# SEO City Suite

Generate and audit local SEO city pages for any service business on Squarespace.

Built with React + Vite. API calls proxied through a Vercel serverless function so your Anthropic API key stays server-side.

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/seo-city-suite.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `seo-city-suite` repository
4. Vercel auto-detects Vite — no framework config needed
5. Before deploying, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (get one at console.anthropic.com)
6. Click **Deploy**

Your live URL will be `https://seo-city-suite.vercel.app` (or similar).

---

## Run locally

```bash
# Install dependencies
npm install

# Add your API key
cp .env.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# Start dev server (runs both Vite + the API function)
npx vercel dev
```

> Use `vercel dev` instead of `npm run dev` so the `/api/claude` serverless function runs locally too.

---

## Project structure

```
seo-city-suite/
├── api/
│   └── claude.js        # Vercel serverless function — proxies Anthropic API calls
├── src/
│   ├── main.jsx         # React entry point
│   └── App.jsx          # Full app (About, Generator, Auditor tabs)
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## How the API proxy works

The app sends requests to `/api/claude` instead of directly to `api.anthropic.com`.
The serverless function in `api/claude.js` adds your API key from `ANTHROPIC_API_KEY`
and forwards the request to Anthropic. The key never touches the browser.

---

## Updating

Any push to `main` automatically redeploys on Vercel.

---

## Tech

- React 18 + Vite
- Vercel (hosting + serverless function)
- Anthropic Claude Sonnet (via API)
- Zero external UI libraries — all inline styles
