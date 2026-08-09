# Agent Console (Vercel version)

## Structure
- `index.html` — the frontend (chat UI), at the repo root — Vercel serves this automatically, no config needed
- `api/chat.js` — serverless function, automatically available at `/api/chat`
- `api/knowledge.txt` — your knowledge base, loaded by the function on every request

## Deploy steps

### 1. Push this to a GitHub repo
Same as before — create a repo, upload `index.html`, `api/chat.js`, `api/knowledge.txt`, keeping that folder structure.

### 2. Connect it to Vercel
1. Go to vercel.com, sign up free with your GitHub account
2. Click **Add New** → **Project**
3. Select this repo, click **Import**
4. Vercel auto-detects everything (no framework, static + functions) — leave settings as default
5. Before clicking Deploy, add your environment variable:
   - Under **Environment Variables**: Name `GEMINI_API_KEY`, Value = your key
6. Click **Deploy**

### 3. Get your link
Vercel gives you a free URL like `https://your-project.vercel.app` immediately after deploy.

### 4. If you add/change the environment variable later
Go to **Settings** → **Environment Variables** on your project, update it, then go to **Deployments** → click the three dots on the latest deployment → **Redeploy** (env var changes need a redeploy to take effect).

## Connecting your Hostinger domain
Same idea as Netlify: in Vercel, go to **Settings** → **Domains** → add your domain → Vercel gives you DNS records (usually an A record and/or CNAME) → add those in Hostinger's DNS Zone Editor. Vercel handles HTTPS automatically once connected.

## Editing later
Everything is editable directly on GitHub (pencil icon → edit → commit), same as your other projects. Vercel auto-redeploys on every push, no manual trigger needed.
