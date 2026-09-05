import { FindingData } from "../detect/types";
import { GraphSnapshotData } from "../graph/types";

export interface ScoreBreakdown {
  canonicalHealth: number;
  indexDirectives: number;
  internalLinkIntegrity: number;
  schemaCoverage: number;
  llmsTxtScore: number;
  citationGroundingScore: number;
}

export interface DeploymentScoreResult {
  searchHealth: number; // 0 - 100
  geoScore: number;     // 0 - 100
  deltaSearch: number;  // e.g. -25
  deltaGeo: number;     // e.g. -27
  breakdown: ScoreBreakdown;
}

export function computeScores(
  currentSnapshot: GraphSnapshotData,
  findings: FindingData[],
  previousScore?: { searchHealth: number; geoScore: number }
): DeploymentScoreResult {
  const pageNodes = currentSnapshot.nodes.filter((n) => n.type === "page");
  const totalPages = Math.max(1, pageNodes.length);

  // 1. Search Health Factors
  const pagesWithCanonical = pageNodes.filter((p) => p.attrs.hasCanonical).length;
  const canonicalRatio = pagesWithCanonical / totalPages;
  const canonicalHealth = Math.round(canonicalRatio * 40); // 40 pts max

  const noindexCount = pageNodes.filter((p) => p.attrs.isNoindexed).length;
  const indexDirectives = noindexCount === 0 ? 30 : Math.max(0, 30 - noindexCount * 10); // 30 pts max

  const orphanCount = currentSnapshot.nodes.filter(
    (n) => n.type === "page" && !currentSnapshot.edges.some((e) => e.toNodeId === n.id && e.kind === "links_to")
  ).length;
  const internalLinkIntegrity = orphanCount === 0 ? 30 : Math.max(10, 30 - orphanCount * 5); // 30 pts max

  const searchHealth = Math.min(100, Math.max(0, canonicalHealth + indexDirectives + internalLinkIntegrity));

  // 2. GEO (AI Answer Engine) Score Factors
  const pagesWithSchema = pageNodes.filter((p) => (p.attrs.schemaTypes?.length || 0) > 0).length;
  const schemaRatio = pagesWithSchema / totalPages;
  const schemaCoverage = Math.round(schemaRatio * 45); // 45 pts max

  // llms.txt factor (presence & health)
  const hasLlmsTxtFinding = findings.some((f) => f.type === "LLMSTXT_INVALID");
  const llmsTxtScore = hasLlmsTxtFinding ? 5 : 25; // 25 pts max

  // Citation Grounding factor
  const hasSchemaRegression = findings.some((f) => f.type === "SCHEMA_REMOVED");
  const citationGroundingScore = hasSchemaRegression ? 10 : 30; // 30 pts max

  const geoScore = Math.min(100, Math.max(0, schemaCoverage + llmsTxtScore + citationGroundingScore));

  // Deltas
  const prevSearch = previousScore?.searchHealth ?? searchHealth;
  const prevGeo = previousScore?.geoScore ?? geoScore;

  return {
    searchHealth,
    geoScore,
    deltaSearch: searchHealth - prevSearch,
    deltaGeo: geoScore - prevGeo,
    breakdown: {
      canonicalHealth,
      indexDirectives,
      internalLinkIntegrity,
      schemaCoverage,
      llmsTxtScore,
      citationGroundingScore,
    },
  };
}
