import * as cheerio from "cheerio";
import { parseHtml } from "@/lib/extract/html-parser";
import { AdvisorPageContent } from "./types";

// Used only when the target URL can't actually be fetched (offline/demo environment),
// mirroring the deterministic-fallback pattern already used by lib/llm/openrouter.ts.
// Keyed by the same product slugs as the Acme Industrial Instruments catalog used by
// the rest of the demo (lib/fixtures/demo-data.ts), so scanning any of those product
// URLs in the Advisor tab returns content matching that product, not a mismatched one.
const DEMO_PAGES: Record<string, string> = {
  "digital-micrometer-caliper": `
<html>
<head>
<title>Digital Micrometer Caliper</title>
<meta name="description" content="Precision digital caliper for machine shop measurement." />
</head>
<body>
<h1>Digital Micrometer Caliper</h1>
<p>Machined from hardened stainless steel, this caliper delivers ±0.01mm calibration accuracy across a 0-150mm measuring range.</p>
<p>Rated IP67 for water and dust resistance, it is built for harsh machine shop environments.</p>
<h2>What's Included</h2>
<p>Every unit ships with a dual LCD readout, a 3-year factory calibration guarantee, and a $149.00 MSRP.</p>
<a href="/products/precision-bench-oscilloscope">Precision Bench Oscilloscope</a>
<a href="/products/laser-tachometer-50000rpm">Laser Tachometer</a>
</body>
</html>
`,
  "precision-bench-oscilloscope": `
<html>
<head>
<title>Precision Bench Oscilloscope</title>
<meta name="description" content="200MHz bench oscilloscope for lab and field diagnostics." />
</head>
<body>
<h1>Precision Bench Oscilloscope</h1>
<p>This bench oscilloscope captures signals up to 200MHz bandwidth with a 1GSa/s real-time sample rate.</p>
<p>The 8-inch color display and dual-channel probing make it suited for high-frequency measurement and probe grounding work.</p>
<h2>Built for the Lab</h2>
<p>Includes USB export, an on-screen FFT mode, and a rack-mount chassis option.</p>
<a href="/products/digital-micrometer-caliper">Digital Micrometer Caliper</a>
<a href="/products/true-rms-digital-multimeter">True-RMS Digital Multimeter</a>
</body>
</html>
`,
  "true-rms-digital-multimeter": `
<html>
<head>
<title>True-RMS Digital Multimeter</title>
<meta name="description" content="6000-count true-RMS multimeter for field electricians." />
</head>
<body>
<h1>True-RMS Digital Multimeter</h1>
<p>This multimeter reads true-RMS voltage, current, and resistance with a 6000-count display and CAT III 600V safety rating.</p>
<p>A backlit display and auto-ranging mode make it fast to use in the field.</p>
<h2>Durability</h2>
<p>Drop-tested to 2 meters with a protective rubberized housing.</p>
<a href="/products/digital-micrometer-caliper">Digital Micrometer Caliper</a>
</body>
</html>
`,
  "infrared-thermal-imager": `
<html>
<head>
<title>Infrared Thermal Imager</title>
<meta name="description" content="Handheld thermal imaging camera for industrial inspection." />
</head>
<body>
<h1>Infrared Thermal Imager</h1>
<p>Captures thermal readings from -20°C to 550°C with a 220x160 pixel infrared sensor.</p>
<p>Built-in visible-light camera overlays thermal and real images for easier fault diagnosis.</p>
<h2>Field Ready</h2>
<p>Rated for 2-meter drop resistance and includes on-device SD card storage.</p>
<a href="/products/digital-micrometer-caliper">Digital Micrometer Caliper</a>
</body>
</html>
`,
  "laser-tachometer-50000rpm": `
<html>
<head>
<title>Laser Tachometer</title>
<meta name="description" content="Handheld laser tachometer for non-contact RPM measurement in industrial settings." />
</head>
<body>
<h1>Laser Tachometer</h1>
<p>Our handheld tachometer measures rotational speed from 2.5 RPM to 50,000 RPM using a non-contact laser sensor.</p>
<p>Housed in a hardened composite shell, it is built for machine shop and field-service environments.</p>
<h2>Why Engineers Choose This Instrument</h2>
<p>Every unit ships with a factory calibration certificate and a backlit LCD readout for low-light readings.</p>
<a href="/products/digital-micrometer-caliper">Digital Micrometer Caliper</a>
<a href="/products/precision-bench-oscilloscope">Precision Bench Oscilloscope</a>
</body>
</html>
`,
};

function fallbackHtmlFor(pageUrl: string): string {
  const slug = Object.keys(DEMO_PAGES).find((s) => pageUrl.includes(s));
  return DEMO_PAGES[slug ?? "laser-tachometer-50000rpm"];
}

export async function extractTargetContent(pageUrl: string): Promise<AdvisorPageContent> {
  let html: string;
  let statusCode = 200;

  try {
    const res = await fetch(pageUrl, { headers: { "User-Agent": "SearchOpsSeoAdvisor/1.0" } });
    statusCode = res.status;
    html = await res.text();
  } catch {
    html = fallbackHtmlFor(pageUrl);
    statusCode = 200;
  }

  const content = parseHtml(pageUrl, html, statusCode);

  const $ = cheerio.load(html);
  $("script, style, noscript, nav, footer").remove();
  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text) paragraphs.push(text);
  });

  return { ...content, paragraphs };
}
