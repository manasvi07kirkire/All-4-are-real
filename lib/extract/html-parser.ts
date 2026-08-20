import * as cheerio from "cheerio";
import { ExtractedPageData } from "./types";

export function parseHtml(url: string, html: string, statusCode = 200): ExtractedPageData {
  const $ = cheerio.load(html);

  // 1. Meta tags
  const title = $("title").first().text().trim() || $("meta[property='og:title']").attr("content") || undefined;
  const metaDescription = $("meta[name='description']").attr("content")?.trim() || undefined;
  const canonicalUrl = $("link[rel='canonical']").attr("href")?.trim() || undefined;

  // 2. Robots
  const robotsMeta = $("meta[name='robots']").attr("content")?.toLowerCase() || "";
  const noindex = robotsMeta.includes("noindex");
  const nofollow = robotsMeta.includes("nofollow");

  // 3. Headings
  const h1: string[] = [];
  $("h1").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1.push(text);
  });

  const h2: string[] = [];
  $("h2").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h2.push(text);
  });

  // 4. Links
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];

  const parsedUrl = new URL(url, "https://example.com");
  const baseUrl = parsedUrl.origin;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
      return;
    }

    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.origin === baseUrl) {
        internalLinks.push(resolved.pathname + resolved.search);
      } else {
        externalLinks.push(resolved.href);
      }
    } catch {
      // Relative or root-relative path
      if (href.startsWith("/")) {
        internalLinks.push(href);
      }
    }
  });

  // 5. JSON-LD Schemas
  const jsonLdSchemas: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html()?.trim();
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          jsonLdSchemas.push(...parsed);
        } else {
          jsonLdSchemas.push(parsed);
        }
      } catch (err) {
        console.warn(`[HTML Parser] Invalid JSON-LD at ${url}:`, err);
      }
    }
  });

  // 6. Open Graph
  const openGraph = {
    title: $("meta[property='og:title']").attr("content") || undefined,
    description: $("meta[property='og:description']").attr("content") || undefined,
    image: $("meta[property='og:image']").attr("content") || undefined,
    type: $("meta[property='og:type']").attr("content") || undefined,
  };

  // 7. Visible text sample (for citation test)
  $("script, style, noscript, svg, nav, footer").remove();
  const textSample = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);

  return {
    url,
    statusCode,
    title,
    metaDescription,
    canonicalUrl,
    robotsDirectives: {
      noindex,
      nofollow,
      raw: robotsMeta || undefined,
    },
    headings: { h1, h2 },
    internalLinks: Array.from(new Set(internalLinks)),
    externalLinks: Array.from(new Set(externalLinks)),
    jsonLdSchemas,
    openGraph,
    textSample,
  };
}
