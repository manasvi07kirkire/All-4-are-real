import { PrismaClient } from "@prisma/client";
import { DEMO_SCENARIO_183, DEMO_SCENARIO_184, DEMO_SCENARIO_185 } from "../lib/fixtures/demo-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SearchOps database...");

  // Clean existing
  await prisma.citationTest.deleteMany();
  await prisma.remediation.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.score.deleteMany();
  await prisma.edge.deleteMany();
  await prisma.node.deleteMany();
  await prisma.graphSnapshot.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.project.deleteMany();

  // Create Project
  const project = await prisma.project.create({
    data: {
      repo: "acme-industries/precision-store",
      siteUrl: "https://store.acme-industrial.com",
      routeManifest: JSON.stringify([
        "/",
        "/products/digital-micrometer-caliper",
        "/products/precision-bench-oscilloscope",
        "/products/true-rms-digital-multimeter",
        "/products/infrared-thermal-imager",
        "/blog/how-to-calibrate-micrometers",
        "/blog/high-frequency-measurement-guide",
        "/docs/calibration-api",
      ]),
      installId: "inst_994812",
    },
  });

  const scenarios = [DEMO_SCENARIO_183, DEMO_SCENARIO_184, DEMO_SCENARIO_185];

  for (const s of scenarios) {
    const deployment = await prisma.deployment.create({
      data: {
        projectId: project.id,
        sha: s.sha,
        deployNumber: s.deployNumber,
        ref: s.ref,
        commitMsg: s.commitMsg,
        author: s.author,
        status: s.status,
      },
    });

    // Score
    await prisma.score.create({
      data: {
        deploymentId: deployment.id,
        searchHealth: s.scores.searchHealth,
        geoScore: s.scores.geoScore,
        deltaSearch: s.scores.deltaSearch,
        deltaGeo: s.scores.deltaGeo,
        breakdown: JSON.stringify(s.scores.breakdown),
      },
    });

    // Findings
    for (const f of s.findings) {
      const finding = await prisma.finding.create({
        data: {
          deploymentId: deployment.id,
          type: f.type,
          severity: f.severity,
          confidence: f.confidence,
          lens: f.lens,
          title: f.title,
          description: f.description || "",
          evidence: JSON.stringify(f.evidence),
          rootCause: JSON.stringify(f.rootCause || {}),
          status: f.status,
        },
      });

      // Remediation for finding
      if (f.type === "CANONICAL_STRIPPED") {
        await prisma.remediation.create({
          data: {
            findingId: finding.id,
            tier: "TIER_A",
            action: "Restore canonical generator in ProductMetadata",
            patchDiff: `--- a/src/app/products/[slug]/page.tsx
+++ b/src/app/products/[slug]/page.tsx
@@ -182,3 +182,7 @@ export async function generateMetadata({ params }: Props): Promise<Metadata> {
   return {
     title: product.name,
     description: product.summary,
+    alternates: {
+      canonical: \`https://store.acme.com/products/\${params.slug}\`,
+    },
   };
 }`,
            prUrl: "https://github.com/acme-industries/precision-store/pull/185",
            prNumber: 185,
            validationResult: JSON.stringify({
              staticCheck: true,
              ruleRecheck: true,
              buildable: true,
            }),
            status: s.deployNumber === 185 ? "APPLIED" : "READY",
          },
        });
      }
    }

    // Graph Snapshot
    const snapshot = await prisma.graphSnapshot.create({
      data: {
        deploymentId: deployment.id,
      },
    });

    // Nodes
    const createdNodeMap = new Map<string, string>(); // oldId -> newId
    for (const node of s.snapshot.nodes) {
      const createdNode = await prisma.node.create({
        data: {
          snapshotId: snapshot.id,
          type: node.type,
          url: node.url,
          key: node.key,
          title: node.title,
          health: node.health,
          attrs: JSON.stringify(node.attrs),
        },
      });
      createdNodeMap.set(node.id, createdNode.id);
    }

    // Edges
    for (const edge of s.snapshot.edges) {
      const fromId = createdNodeMap.get(edge.fromNodeId);
      const toId = createdNodeMap.get(edge.toNodeId);
      if (fromId && toId) {
        await prisma.edge.create({
          data: {
            snapshotId: snapshot.id,
            fromNodeId: fromId,
            toNodeId: toId,
            kind: edge.kind,
          },
        });
      }
    }
  }

  // Add a sample citation test
  await prisma.citationTest.create({
    data: {
      url: "/products/digital-micrometer-caliper",
      query: "What is the calibration accuracy and housing material of this caliper?",
      modelAnswer:
        "The Digital Micrometer Caliper features a hardened stainless steel housing and provides a precision calibration accuracy of ±0.01mm across its 0-150mm measuring range.",
      modelUsed: "meta-llama/llama-3.3-70b-instruct:free",
      groundedFacts: JSON.stringify([
        { fact: "Hardened stainless steel housing", isGrounded: true },
        { fact: "±0.01mm calibration accuracy", isGrounded: true },
        { fact: "0-150mm measuring range", isGrounded: true },
        { fact: "IP67 water resistance rating", isGrounded: true },
      ]),
      score: 5,
      totalFacts: 4,
    },
  });

  console.log("Seeding complete! Database initialized with deployments #183, #184, #185.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
