import { ExtractedPageData } from "../extract/types";
import { GraphEdgeData, GraphNodeData, GraphSnapshotData, NodeHealth } from "./types";

export function buildDiscoverabilityGraph(
  deploymentId: string,
  pages: ExtractedPageData[]
): GraphSnapshotData {
  const nodes: GraphNodeData[] = [];
  const edges: GraphEdgeData[] = [];
  const pageMapByUrl = new Map<string, string>(); // url -> nodeId

  // 1. Identify and create template nodes
  const templateMap = new Map<string, string>(); // templateName -> templateNodeId
  
  function getTemplateForUrl(url: string): string {
    if (url.startsWith("/products") || url.startsWith("/item")) return "ProductPage.tsx";
    if (url.startsWith("/blog") || url.startsWith("/posts")) return "BlogPost.tsx";
    if (url.startsWith("/docs") || url.startsWith("/guide")) return "DocPage.tsx";
    return "GenericPage.tsx";
  }

  // 2. Create Schema Entity Nodes registry
  const schemaNodeMap = new Map<string, string>(); // schemaType -> schemaNodeId

  // First pass: create all Page nodes
  pages.forEach((page, idx) => {
    const pageNodeId = `node_page_${idx}_${page.url.replace(/[^a-zA-Z0-9]/g, "_")}`;
    pageMapByUrl.set(page.url, pageNodeId);

    const templateName = getTemplateForUrl(page.url);
    if (!templateMap.has(templateName)) {
      const templateNodeId = `node_template_${templateName.replace(/[^a-zA-Z0-9]/g, "_")}`;
      templateMap.set(templateName, templateNodeId);
      nodes.push({
        id: templateNodeId,
        type: "template",
        url: templateName,
        key: templateName,
        title: `Template: ${templateName}`,
        health: "PASS",
        attrs: { templateName },
      });
    }

    // Determine individual page health
    let health: NodeHealth = "PASS";
    const hasCanonical = Boolean(page.canonicalUrl);
    const isNoindexed = page.robotsDirectives.noindex;
    const hasSchema = page.jsonLdSchemas.length > 0;

    if (isNoindexed || (!hasCanonical && !page.url.includes("404"))) {
      health = "REGRESSION";
    } else if (!hasSchema && (page.url.startsWith("/products") || page.url.startsWith("/blog"))) {
      health = "DEGRADED";
    }

    const schemaTypes = page.jsonLdSchemas.map((s) => s["@type"]).filter(Boolean);

    nodes.push({
      id: pageNodeId,
      type: "page",
      url: page.url,
      key: page.url,
      title: page.title || page.url,
      health,
      attrs: {
        statusCode: page.statusCode,
        hasCanonical,
        canonicalTarget: page.canonicalUrl,
        isNoindexed,
        schemaTypes,
        internalOutlinks: page.internalLinks.length,
        templateName,
      },
    });

    // Edge: Page renders from Template
    edges.push({
      id: `edge_render_${pageNodeId}_${templateMap.get(templateName)}`,
      fromNodeId: pageNodeId,
      toNodeId: templateMap.get(templateName)!,
      kind: "renders_from",
    });

    // Schema nodes and edges
    schemaTypes.forEach((st) => {
      const typeStr = Array.isArray(st) ? st[0] : st;
      if (!schemaNodeMap.has(typeStr)) {
        const schemaNodeId = `node_schema_${typeStr.replace(/[^a-zA-Z0-9]/g, "_")}`;
        schemaNodeMap.set(typeStr, schemaNodeId);
        nodes.push({
          id: schemaNodeId,
          type: "schema",
          url: `schema:${typeStr}`,
          key: typeStr,
          title: `Schema: ${typeStr}`,
          health: "PASS",
          attrs: { schemaType: typeStr },
        });
      }

      edges.push({
        id: `edge_schema_${pageNodeId}_${schemaNodeMap.get(typeStr)}`,
        fromNodeId: pageNodeId,
        toNodeId: schemaNodeMap.get(typeStr)!,
        kind: "has_schema",
      });
    });
  });

  // Second pass: Link graph & Canonical graph
  pages.forEach((page) => {
    const fromNodeId = pageMapByUrl.get(page.url);
    if (!fromNodeId) return;

    // Internal links
    page.internalLinks.forEach((targetUrl) => {
      const cleanTarget = targetUrl.split("?")[0].split("#")[0];
      const toNodeId = pageMapByUrl.get(cleanTarget);
      if (toNodeId && toNodeId !== fromNodeId) {
        edges.push({
          id: `edge_link_${fromNodeId}_${toNodeId}`,
          fromNodeId,
          toNodeId,
          kind: "links_to",
        });
      }
    });

    // Canonical to
    if (page.canonicalUrl) {
      try {
        const targetPath = new URL(page.canonicalUrl, "https://example.com").pathname;
        const toCanonicalNodeId = pageMapByUrl.get(targetPath);
        if (toCanonicalNodeId) {
          edges.push({
            id: `edge_canon_${fromNodeId}_${toCanonicalNodeId}`,
            fromNodeId,
            toNodeId: toCanonicalNodeId,
            kind: "canonical_to",
          });
        }
      } catch {
        // External canonical
      }
    }
  });

  return {
    id: `snapshot_${deploymentId}`,
    deploymentId,
    nodes,
    edges,
    createdAt: new Date().toISOString(),
  };
}
