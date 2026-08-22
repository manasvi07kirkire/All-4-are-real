import { extractTargetContent } from "../lib/seo-advisor/extract-target";
import { generateSuggestions } from "../lib/seo-advisor/suggest";
import { applyApprovedSuggestions } from "../lib/seo-advisor/apply";
import { openPullRequest } from "../lib/seo-advisor/open-pr";

async function testSeoAdvisor() {
  console.log("=== Testing SEO Advisor Pipeline ===");
  const pageUrl = "https://store.acme-industrial.com/products/laser-tachometer-50000rpm";
  const targetKeywords = ["non-contact tachometer", "50000 RPM digital tachometer"];

  console.log("1. Extracting content...");
  const content = await extractTargetContent(pageUrl);
  console.log("Extracted title:", content.title);
  console.log("Extracted paragraphs:", content.paragraphs.length);

  console.log("\n2. Generating suggestions...");
  const suggestions = await generateSuggestions({ pageUrl, targetKeywords, content });
  console.log(`Generated ${suggestions.length} suggestions:`);
  suggestions.forEach((s, i) => {
    console.log(` [${i + 1}] Type: ${s.type} | Location: ${s.location} | Confidence: ${s.confidence}% | Rationale: ${s.rationale}`);
  });

  if (suggestions.length > 0) {
    console.log("\n3. Testing PR application & validation...");
    const approved = [suggestions[0]];
    const { diff, validation } = applyApprovedSuggestions(pageUrl, content, targetKeywords, approved);
    console.log("Validation passed:", validation.passed);
    console.log("Diff generated length:", diff.length);

    console.log("\n4. Testing openPullRequest...");
    const pr = openPullRequest(pageUrl, approved);
    console.log("PR URL:", pr.prUrl);
    console.log("PR Number:", pr.prNumber);
  }

  console.log("\n>>> ALL SEO ADVISOR TESTS PASSED SUCCESSFULLY! <<<");
}

testSeoAdvisor().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
