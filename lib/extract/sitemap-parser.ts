import { XMLParser } from "fast-xml-parser";

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export function parseSitemapXml(xmlContent: string): SitemapEntry[] {
  if (!xmlContent || !xmlContent.trim()) return [];

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  try {
    const parsed = parser.parse(xmlContent);
    const urlset = parsed.urlset;

    if (!urlset || !urlset.url) {
      return [];
    }

    const urls = Array.isArray(urlset.url) ? urlset.url : [urlset.url];
    return urls.map((u: any) => ({
      loc: u.loc,
      lastmod: u.lastmod,
      changefreq: u.changefreq,
      priority: u.priority ? parseFloat(u.priority) : undefined,
    }));
  } catch (err) {
    console.warn("[Sitemap Parser] XML parse error:", err);
    return [];
  }
}
