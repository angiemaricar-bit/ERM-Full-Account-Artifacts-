# ERM Account Planning — Live Version

This turns your two HTML tools into a real website that anyone with the link
can open and edit, with changes visible to everyone instantly. No install,
no coding — about 10 minutes of clicking following the steps below.

## What's in this folder
- `index.html` — the full account planning tool (was "vAM_vFinal")
- `thin-account.html` — the thin account template (reachable at `/thin` once live)
- `api/data.js` — the tiny backend that saves/loads data
- `vercel.json`, `package.json` — config files, don't need to touch these

## Step 1 — Create a free database (Upstash), ~2 minutes
1. Go to https://console.upstash.com and sign up (free, no credit card).
2. Click **Create Database**.
3. Name it anything (e.g. `erm-planning`). Pick the region closest to your team.
4. Once created, open the database and find the **REST API** section.
5. Copy two values — you'll need them in Step 3:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 2 — Put this folder on GitHub, ~3 minutes
Vercel deploys from a GitHub repo.
1. Go to https://github.com/new, create a new **private** repository
   (e.g. `erm-account-planning`).
2. On your computer, upload all the files in this folder to that repo
   (GitHub's web UI has an "Add file → Upload files" button — drag
   these files in, no command line needed).

## Step 3 — Deploy on Vercel, ~3 minutes
1. Go to https://vercel.com and sign up with your GitHub account (free tier).
2. Click **Add New → Project**, and select the repo you just created.
3. Before clicking Deploy, open **Environment Variables** and add:
   - `UPSTASH_REDIS_REST_URL` → paste the value from Step 1
   - `UPSTASH_REDIS_REST_TOKEN` → paste the value from Step 1
4. Click **Deploy**. In about 30 seconds you'll get a live URL like:
   `https://erm-account-planning.vercel.app`

That's it — that URL is now permanent and live. `/` opens the full tool,
`/thin` opens the thin account template. Anyone with the link can edit,
and everyone sees the same saved data because it's all stored in the one
Upstash database.

## How updates work from here
- Edits in the browser autosave to the database (same as before) —
  no redeploy needed for day-to-day use.
- If you want to change the *design or fields* of the tool later, edit
  `index.html` (or `thin-account.html`), push the change to GitHub, and
  Vercel auto-redeploys in ~30 seconds. Just send me the updated file and
  I'll fold the changes in and hand it back for you to re-upload.

## Notes
- **Anyone with the link can edit** — there's no login. If you later want
  edit access restricted to certain people, that's a follow-on step
  (simple password gate or real login) — just ask.
- The free tiers of Vercel and Upstash are generous enough for internal
  team tools like this; no cost expected unless usage is very heavy.
