# Saytica Eval Console

A small full-stack Next.js app for comparing model evaluation results and reviewing annotation task progress.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

- `GET /api/models` returns normalized model leaderboard rows.
- `GET /api/tasks` returns normalized annotation tasks.
- `PATCH /api/tasks/:id` advances or updates a task status.

## Data Handling Notes

- Model names are trimmed before display.
- Provider casing is normalized for readability.
- Missing model metrics render as `Not evaluated` or `Unknown`, and sort last.
- Mixed date formats are parsed when possible.
- Empty task statuses are treated as `pending`.
- Unassigned tasks are preserved and shown as `Unassigned` in client summaries.

> **Note:** Task status updates require a writable filesystem and work locally. 
> A database integration (e.g. Vercel KV or Neon) would be needed for production.
