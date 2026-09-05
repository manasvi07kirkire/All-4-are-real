import { LlmsTxtData } from "./types";

/**
 * Parses and validates llms.txt standard files according to https://llmstxt.org/
 */
export function parseLlmsTxt(content: string): LlmsTxtData {
  if (!content || !content.trim()) {
    return {
      exists: false,
      isValid: false,
      sections: [],
      referencedPaths: [],
      errors: ["llms.txt file is missing or empty"],
    };
  }

  const lines = content.split(/\r?\n/);
  let title: string | undefined;
  let summary: string | undefined;
  const sections: { title: string; links: { title: string; url: string; description?: string }[] }[] = [];
  const referencedPaths: string[] = [];
  const errors: string[] = [];

  let currentSection = { title: "General", links: [] as any[] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ") && !title) {
      title = trimmed.replace(/^#\s+/, "");
      continue;
    }

    if (trimmed.startsWith("> ") && !summary) {
      summary = trimmed.replace(/^>\s+/, "");
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (currentSection.links.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmed.replace(/^##\s+/, ""),
        links: [],
      };
      continue;
    }

    // Match markdown links: - [Title](url): Description
    const linkMatch = trimmed.match(/^-\s+\[(.*?)\]\((.*?)\)(?::\s*(.*))?$/);
    if (linkMatch) {
      const linkTitle = linkMatch[1];
      const linkUrl = linkMatch[2];
      const linkDesc = linkMatch[3];

      currentSection.links.push({
        title: linkTitle,
        url: linkUrl,
        description: linkDesc,
      });

      referencedPaths.push(linkUrl);
    }
  }

  if (currentSection.links.length > 0) {
    sections.push(currentSection);
  }

  if (!title) {
    errors.push("Missing H1 title in llms.txt");
  }

  return {
    exists: true,
    isValid: errors.length === 0 && sections.length > 0,
    title,
    summary,
    sections,
    referencedPaths,
    errors,
  };
}
