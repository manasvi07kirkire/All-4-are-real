# SearchOps — Discoverability CI/CD for the Dual-Audience Web

> **The discoverability CI/CD layer for search crawlers and AI answer engines.**  
> Watches every deployment through two lenses, detects when a code change silently breaks machine-legibility, traces the break down to the exact `file:line`, and ships autonomous tiered fixes.

---

## ⚡ Core Value Proposition

Every modern website is read by two machine audiences:
1. **Search Crawlers** (Googlebot, Bingbot)
2. **AI Answer Engines** (ChatGPT Search, Perplexity, Google AI Overviews, Copilot)

A single deployment can silently break machine-legibility for either audience — a routing change drops canonical tags; a component refactor strips the structured JSON-LD entities an LLM needs to cite the page. SearchOps continuously watches deployments, computes dual-lens scores, and opens validated GitHub PRs.

---

## 🛠️ Architecture & Features

- **Dual-Lens Scoring**:
  - **Search Crawler Health** (Canonical health, index directives, internal link graph)
  - **AI-Answer Engine Citation-Readiness (GEO)** (Structured schema completeness, `llms.txt` validation, live citation-probability test)
- **Deterministic Detection Engine**: 100% pure TypeScript rules engine. Zero hallucinations.
- **AST Root Cause Attribution**: Signature matcher over git diffs pinpointing exact `file:line` (e.g., `ProductPage.tsx:184`).
- **Live GEO Citation-Probability Test**: Evaluates fact grounding of AI answer engine responses in real time.
- **Strict Remediation Tiers**:
  - `● TIER A (Auto-Fix)`: Declarative, template-safe fixes (canonicals, schemas, metadata) with a 3-step automated validation gate.
  - `▲ TIER B (Draft PR)`: Structural/template changes opened as Draft PRs for review.
  - `■ TIER C (Approval Only)`: High-risk URL/redirect changes requiring manual human sign-off.
- **Weathered-Metal Instrument UI**: Precision dark-first aesthetic (`#100E0C`), Fraunces serif display, Hanken Grotesk body, and Commit Mono tabular numbers.

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Parth-Gholap/Search-Ops.git
cd Search-Ops
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your `OPENROUTER_API_KEY` (or leave empty to use the built-in deterministic demo fallback).

### 3. Initialize Database & Seed Scenarios
```bash
npx prisma generate
npx prisma db push
npx -y tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment on Vercel

1. Import the repository into [Vercel](https://vercel.com).
2. Set the environment variable:
   - `OPENROUTER_API_KEY`: Your OpenRouter API Key
   - `DATABASE_URL`: `"file:./dev.db"`
3. Deploy!

---

## 📜 License
MIT License.
