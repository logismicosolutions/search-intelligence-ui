
# Search Intelligence AI – Next.js Demo UI

Ready-to-run hackathon UI for your **Search Intelligence AI** concept.

## What you get
- **Overview** dashboard with KPI cards + intents table
- **Intent drawer** with Evidence / Coverage / Recommendations / Explainability
- **Action Center** (kanban-ish) with status updates
- **Search Fix Studio** (export synonyms JSON + simulated impact)
- **Content Gap Studio** (export brief Markdown)
- **Pipeline** animated stepper
- Mock APIs under `/app/api/*` backed by JSON files in `/data`

## Prerequisites
- Node.js 18.17+ (or Node 20+ recommended)

## Run
```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Folder layout (important bits)
```
app/
  page.tsx                 # Overview
  intents/page.tsx         # Intent Explorer
  actions/page.tsx         # Action Center
  search-fix/page.tsx      # Search Fix Studio
  content-gap/page.tsx     # Content Gap Studio
  pipeline/page.tsx        # Pipeline
  api/
    intents/route.ts
    intents/[intentId]/route.ts
    actions/route.ts
    export/
      synonyms/route.ts
      content-brief/route.ts
      bundle/route.ts

components/
  AppShell.tsx
  KpiCards.tsx
  IntentTable.tsx
  IntentDrawer.tsx
  KanbanBoard.tsx

data/
  intents.json
  intentDetails.json
  actions.json
```

## Demo flow (quick)
1. Go to **Overview** → click **Run Analysis**
2. Click an intent row → open drawer → view Explainability
3. Click **Create Action** → open **Action Center**
4. Try **Search Fix Studio** and export synonyms
5. Try **Content Gap Studio** and export content brief

## Notes
- This is a UI-first MVP; replace mock APIs with your real microservice later.
- The API routes currently mutate `data/actions.json` for demo purposes.

Generated: 2026-01-14T20:56:53.775124Z
