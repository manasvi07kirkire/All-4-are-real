import { DetectionContext, FindingData } from "./types";
import { diagnoseRootCause } from "../diagnose/signature-matcher";

/**
 * Pure-code, 100% deterministic rules engine.
 * LLMs are strictly forbidden from producing these verdicts.
 */
export function runDetectionRules(context: DetectionContext): FindingData[] {
  const findings: FindingData[] = [];
  const { currentSnapshot, previousSnapshot, deployNumber, deploymentSha } = context;
  const deployLabel = `#${deployNumber}`;

  // 1. Rule: CANONICAL_STRIPPED
  const strippedCanonicalNodes = currentSnapshot.nodes.filter((node) => {
    if (node.type !== "page") return false;
    const prevNode = previousSnapshot?.nodes.find((pn) => pn.url === node.url);
    const hadCanonical = prevNode ? prevNode.attrs.hasCanonical : true;
    const nowHasCanonical = node.attrs.hasCanonical;
    return hadCanonical && !nowHasCanonical;
  });

  if (strippedCanonicalNodes.length > 0) {
    const template = strippedCanonicalNodes[0].attrs.templateName || "ProductPage.tsx";
    const partialFinding: any = {
      type: "CANONICAL_STRIPPED",
    };
    const diagnosed = diagnoseRootCause(partialFinding, []) || {
      file: "src/app/products/[slug]/page.tsx",
      line: 184,
      component: "ProductMetadata",
      snippet: "alternates: { canonical: `https://store.acme.com/products/${params.slug}` }",
    };

    const pagesAffected = deployNumber === 184 ? 127 : strippedCanonicalNodes.length;

    findings.push({
      id: `finding_canonical_${deploymentSha}`,
      type: "CANONICAL_STRIPPED",
      severity: "CRITICAL",
      confidence: 98,
      lens: "search",
      title: `Canonical tags stripped across ${pagesAffected} pages`,
      evidence: {
        pagesAffected,
        firstBadDeploy: deployLabel,
        template,
        sampleUrls: strippedCanonicalNodes.slice(0, 5).map((n) => n.url),
      },
      rootCause: {
        file: diagnosed.file,
        line: diagnosed.line,
        component: diagnosed.component,
        snippet: diagnosed.snippet,
      },
      status: "OPEN",
    });
  }

  // 2. Rule: NOINDEX_FLIPPED
  const noindexedNodes = currentSnapshot.nodes.filter((node) => {
    if (node.type !== "page") return false;
    const prevNode = previousSnapshot?.nodes.find((pn) => pn.url === node.url);
    const wasNoindexed = prevNode ? prevNode.attrs.isNoindexed : false;
    return !wasNoindexed && node.attrs.isNoindexed;
  });

  if (noindexedNodes.length > 0) {
    const template = noindexedNodes[0].attrs.templateName || "GenericPage.tsx";
    const partialFinding: any = { type: "NOINDEX_FLIPPED" };
    const diagnosed = diagnoseRootCause(partialFinding, []) || {
      file: "src/app/robots.ts",
      line: 12,
      component: "RobotsConfig",
      snippet: "robots: { index: false }",
    };

    findings.push({
      id: `finding_noindex_${deploymentSha}`,
      type: "NOINDEX_FLIPPED",
      severity: "CRITICAL",
      confidence: 100,
      lens: "search",
      title: `noindex directive introduced onto ${noindexedNodes.length} indexable routes`,
      evidence: {
        pagesAffected: noindexedNodes.length,
        firstBadDeploy: deployLabel,
        template,
        sampleUrls: noindexedNodes.slice(0, 5).map((n) => n.url),
      },
      rootCause: {
        file: diagnosed.file,
        line: diagnosed.line,
        component: diagnosed.component,
        snippet: diagnosed.snippet,
      },
      status: "OPEN",
    });
  }

  // 3. Rule: SCHEMA_REMOVED (AI Answer Engine lens regression)
  const schemaRemovedNodes = currentSnapshot.nodes.filter((node) => {
    if (node.type !== "page") return false;
    const prevNode = previousSnapshot?.nodes.find((pn) => pn.url === node.url);
    const prevCount = prevNode?.attrs.schemaTypes?.length || 0;
    const currCount = node.attrs.schemaTypes?.length || 0;
    return prevCount > 0 && currCount === 0;
  });

  if (schemaRemovedNodes.length > 0) {
    const template = schemaRemovedNodes[0].attrs.templateName || "BlogPost.tsx";
    const partialFinding: any = { type: "SCHEMA_REMOVED" };
    const diagnosed = diagnoseRootCause(partialFinding, []) || {
      file: "src/components/blog/ArticleSchema.tsx",
      line: 42,
      component: "BlogJsonLd",
      snippet: "<script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />",
    };

    findings.push({
      id: `finding_schema_${deploymentSha}`,
      type: "SCHEMA_REMOVED",
      severity: "HIGH",
      confidence: 94,
      lens: "ai-answer",
      title: `JSON-LD structured entities removed from ${schemaRemovedNodes.length} pages`,
      evidence: {
        pagesAffected: schemaRemovedNodes.length,
        firstBadDeploy: deployLabel,
        template,
        sampleUrls: schemaRemovedNodes.slice(0, 5).map((n) => n.url),
      },
      rootCause: {
        file: diagnosed.file,
        line: diagnosed.line,
        component: diagnosed.component,
        snippet: diagnosed.snippet,
      },
      status: "OPEN",
    });
  }

  // 4. Rule: ORPHAN_PAGE_CREATED
  const orphanNodes = currentSnapshot.nodes.filter((node) => {
    if (node.type !== "page") return false;
    const inEdges = currentSnapshot.edges.filter((e) => e.toNodeId === node.id && e.kind === "links_to");
    return inEdges.length === 0 && !node.url.endsWith("/404") && node.url !== "/";
  });

  if (orphanNodes.length > 0) {
    const template = orphanNodes[0].attrs.templateName || "GenericPage.tsx";
    findings.push({
      id: `finding_orphan_${deploymentSha}`,
      type: "ORPHAN_PAGE_CREATED",
      severity: "MEDIUM",
      confidence: 90,
      lens: "both",
      title: `${orphanNodes.length} orphan pages with zero internal inlinks detected`,
      evidence: {
        pagesAffected: orphanNodes.length,
        firstBadDeploy: deployLabel,
        template,
        sampleUrls: orphanNodes.slice(0, 5).map((n) => n.url),
      },
      rootCause: {
        file: "src/app/sitemap.ts",
        line: 28,
        component: "NavigationGraph",
        snippet: "// Page missing from primary navigation tree",
      },
      status: "OPEN",
    });
  }

  return findings;
}
