# Phase 10: Production & Deployment — React Complete Tutorial

> From development to live — everything you need to ship a React app with confidence.

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [Production Builds](#2-production-builds)
3. [Vercel Deployment](#3-vercel-deployment)
4. [Netlify Deployment](#4-netlify-deployment)
5. [GitHub Pages](#5-github-pages)
6. [Custom Domains](#6-custom-domains)

---

## 1. Environment Variables

Environment variables let you store configuration values (API keys, URLs, feature flags) outside your source code. React (via Vite or Create React App) has different conventions depending on your toolchain.

### 1.1 Create React App (CRA)

All environment variables **must be prefixed with `REACT_APP_`** to be accessible in your code.

```bash
# .env
REACT_APP_API_URL=https://api.example.com
REACT_APP_STRIPE_KEY=pk_live_abc123
```

Access them in your components:

```jsx
// Any component
const apiUrl = process.env.REACT_APP_API_URL;

function PaymentButton() {
  return (
    <button onClick={() => initStripe(process.env.REACT_APP_STRIPE_KEY)}>
      Pay Now
    </button>
  );
}
```

### 1.2 Vite Projects

Vite uses the `VITE_` prefix, and variables are accessed via `import.meta.env`:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_FEATURE_FLAG=true
```

```jsx
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;       // built-in: true in development
const isProd = import.meta.env.PROD;     // built-in: true in production
const mode = import.meta.env.MODE;       // "development" or "production"
```

### 1.3 Environment Files & Load Order

Both CRA and Vite support multiple `.env` files, loaded in this priority order (highest → lowest):

| File | When it's used |
|------|---------------|
| `.env.local` | Always (overrides everything, never commit) |
| `.env.development.local` | `npm start` only |
| `.env.production.local` | `npm run build` only |
| `.env.development` | `npm start` |
| `.env.production` | `npm run build` |
| `.env` | Always (base defaults) |

### 1.4 Security Rules

```bash
# ✅ Safe — public keys meant for the browser
REACT_APP_GOOGLE_MAPS_KEY=AIzaSy...

# ❌ NEVER put these in .env files committed to git
STRIPE_SECRET_KEY=sk_live_...      # Server-side only!
DATABASE_PASSWORD=supersecret      # Server-side only!
```

**Always add `.env.local` and `.env.*.local` to `.gitignore`:**

```bash
# .gitignore
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 1.5 TypeScript: Typing Environment Variables (Vite)

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FEATURE_FLAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 2. Production Builds

### 2.1 What a Production Build Does

Running `npm run build` triggers several optimizations:

- **Minification** — removes whitespace, shortens variable names
- **Tree-shaking** — removes unused code
- **Code splitting** — breaks app into smaller chunks loaded on demand
- **Asset hashing** — filenames like `main.a3f8c2.js` for cache busting
- **Dead code elimination** — strips `console.log`, dev warnings

### 2.2 Building the App

**Create React App:**
```bash
npm run build
# Output: /build directory
```

**Vite:**
```bash
npm run build
# Output: /dist directory
```

### 2.3 Analyzing Bundle Size

Install the bundle analyzer to find what's eating your KB:

```bash
# CRA
npm install --save-dev source-map-explorer
```

Add to `package.json`:
```json
{
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

**Vite — using rollup-plugin-visualizer:**
```bash
npm install --save-dev rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true }) // Opens browser with bundle map after build
  ]
});
```

### 2.4 Performance Optimization Before Building

**Code splitting with React.lazy:**
```jsx
import { lazy, Suspense } from 'react';

// ✅ This page is loaded only when the user navigates to /dashboard
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**Preloading critical routes:**
```jsx
// Trigger a preload on hover — user hasn't clicked yet
<Link
  to="/dashboard"
  onMouseEnter={() => import('./pages/Dashboard')}
>
  Dashboard
</Link>
```

### 2.5 Previewing the Production Build Locally

```bash
# CRA
npx serve -s build

# Vite
npm run preview
# or: npx vite preview
```

This runs the production build on a local server — always test this before deploying.

---

## 3. Vercel Deployment

Vercel is the zero-config platform built by the creators of Next.js. It's the fastest way to deploy React apps.

### 3.1 Deploy via Vercel CLI

```bash
# Install globally
npm install -g vercel

# From your project root
vercel

# Follow the interactive prompts:
# ? Set up and deploy project? Y
# ? Which scope? your-username
# ? Link to existing project? N
# ? Project name: my-react-app
# ? In which directory is your code? ./
# ? Override settings? N
```

Your app is live in under 60 seconds at `https://my-react-app.vercel.app`.

### 3.2 Deploy via GitHub Integration (Recommended)

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Vercel auto-detects Create React App / Vite — no config needed
5. Click **Deploy**

Every future `git push` to `main` triggers a new production deployment automatically.

### 3.3 Configuring Vercel

For custom build settings, add `vercel.json` to your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> **The `rewrites` rule is essential for React Router.** Without it, refreshing a route like `/about` returns a 404.

### 3.4 Environment Variables on Vercel

1. Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add key/value pairs
3. Choose scope: **Production**, **Preview**, or **Development**

Or via CLI:
```bash
vercel env add VITE_API_URL production
# Paste value when prompted
```

### 3.5 Preview Deployments

Every pull request automatically gets a unique preview URL:
```
https://my-react-app-git-feature-branch-username.vercel.app
```

This makes code review with live previews effortless.

---

## 4. Netlify Deployment

Netlify is another excellent platform with powerful features like form handling, serverless functions, and edge compute.

### 4.1 Deploy via Netlify CLI

```bash
# Install globally
npm install -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --dir=dist        # Vite output
# or
netlify deploy --dir=build       # CRA output

# When ready for production
netlify deploy --dir=dist --prod
```

### 4.2 Deploy via GitHub Integration

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect GitHub and select your repo
4. Configure:

| Setting | CRA Value | Vite Value |
|---------|-----------|------------|
| Build command | `npm run build` | `npm run build` |
| Publish directory | `build` | `dist` |

5. Click **Deploy site**

### 4.3 Netlify Configuration File

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Critical: fixes React Router on page refresh
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Custom headers for security & caching
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'"
```

### 4.4 Environment Variables on Netlify

**Via UI:** Site settings → **Environment variables** → Add variable

**Via CLI:**
```bash
netlify env:set VITE_API_URL https://api.example.com
netlify env:list   # View all
```

### 4.5 Netlify Functions (Serverless)

Netlify lets you run backend code alongside your React app — useful for protecting secret keys:

```javascript
// netlify/functions/get-data.js
exports.handler = async (event, context) => {
  // process.env.SECRET_KEY is safe here — server-side only
  const data = await fetch('https://api.example.com', {
    headers: { Authorization: `Bearer ${process.env.SECRET_KEY}` }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(await data.json())
  };
};
```

Call from your React app:
```jsx
const res = await fetch('/.netlify/functions/get-data');
```

---

## 5. GitHub Pages

GitHub Pages is free static hosting built into every GitHub repository. It's ideal for portfolios, documentation, and open-source project demos.

### 5.1 Setup for Vite

**Install the gh-pages package:**
```bash
npm install --save-dev gh-pages
```

**Configure `vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Must match your GitHub repository name
});
```

**Add deploy scripts to `package.json`:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Deploy:**
```bash
npm run deploy
```

This builds the app and pushes the `dist` folder to a `gh-pages` branch on your repo.

### 5.2 Setup for Create React App

CRA is slightly simpler — just add `homepage` to `package.json`:

```json
{
  "name": "my-app",
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

```bash
npm run deploy
```

### 5.3 Enable GitHub Pages in Repository Settings

1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** / **/ (root)**
5. Click **Save**

Your site will be live at `https://yourusername.github.io/your-repo-name/`

### 5.4 Automate with GitHub Actions

Instead of deploying manually, automate on every push to `main`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 5.5 Fixing React Router on GitHub Pages

GitHub Pages doesn't support client-side routing out of the box. There are two solutions:

**Option A — Use HashRouter (easiest):**
```jsx
import { HashRouter } from 'react-router-dom';
// Routes will look like: /#/about instead of /about
```

**Option B — 404.html redirect trick:**

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      // Redirect all 404s back to index.html with the path preserved
      const path = window.location.pathname;
      window.location.replace(
        window.location.origin + '/?redirect=' + encodeURIComponent(path)
      );
    </script>
  </head>
</html>
```

Add to `public/index.html` `<head>`:
```html
<script>
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (redirect) window.history.replaceState(null, null, redirect);
</script>
```

---

## 6. Custom Domains

Connecting a custom domain (`www.myapp.com`) to your deployed React app varies slightly per platform.

### 6.1 Custom Domains on Vercel

1. Dashboard → Your Project → **Settings** → **Domains**
2. Type your domain (e.g., `myapp.com`) → **Add**
3. Vercel shows you DNS records to add

**At your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):**

For apex domain (`myapp.com`):
```
Type:  A
Name:  @
Value: 76.76.21.21    ← Vercel's IP
```

For `www` subdomain:
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
```

4. Vercel auto-provisions a free SSL certificate via Let's Encrypt

### 6.2 Custom Domains on Netlify

1. **Domain management** → **Add a domain**
2. Enter your domain and follow prompts

**Option A — Use Netlify DNS (recommended):**

Change your domain's nameservers at your registrar to:
```
dns1.p04.nsone.net
dns2.p04.nsone.net
dns3.p04.nsone.net
dns4.p04.nsone.net
```
Netlify handles all DNS records and SSL automatically.

**Option B — External DNS:**

Add these records at your registrar:
```
# Apex domain
Type:  A
Name:  @
Value: 75.2.60.5

# www
Type:  CNAME
Name:  www
Value: your-site-name.netlify.app
```

### 6.3 Custom Domains on GitHub Pages

GitHub Pages only supports one custom domain per repository.

1. **Settings** → **Pages** → **Custom domain** → enter `www.myapp.com`
2. GitHub creates a `CNAME` file in your repo automatically

**At your domain registrar:**
```
# For www subdomain (recommended)
Type:  CNAME
Name:  www
Value: yourusername.github.io

# For apex domain — add all 4 A records
Type:  A  Name: @  Value: 185.199.108.153
Type:  A  Name: @  Value: 185.199.109.153
Type:  A  Name: @  Value: 185.199.110.153
Type:  A  Name: @  Value: 185.199.111.153
```

3. Check **Enforce HTTPS** once DNS propagates (can take up to 48 hours)

### 6.4 Cloudflare as a DNS Proxy (Recommended for Any Platform)

Using Cloudflare as your DNS provider adds a CDN, DDoS protection, and performance improvements for free:

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain → Cloudflare scans existing records
3. Change nameservers at your registrar to Cloudflare's
4. Add records pointing to your host (Vercel/Netlify/GitHub IPs)
5. Toggle the orange proxy cloud ☁️ on for caching/protection

```
# Example Cloudflare records for Vercel
Type:  A      Name: @    Value: 76.76.21.21   Proxy: ✅ ON
Type:  CNAME  Name: www  Value: cname.vercel-dns.com  Proxy: ✅ ON
```

> **Note:** When using Cloudflare proxy with Vercel/Netlify, disable "Full SSL" verification conflicts by setting SSL/TLS mode to **Full** in Cloudflare dashboard.

### 6.5 Verifying Your SSL Certificate

After DNS propagates, verify your SSL is working:

```bash
# Check DNS propagation
dig myapp.com A
dig www.myapp.com CNAME

# Check SSL
curl -I https://myapp.com
# Look for: HTTP/2 200 and valid certificate info
```

Online tools: [dnschecker.org](https://dnschecker.org) | [ssllabs.com/ssltest](https://ssllabs.com/ssltest)

---

## Quick Reference Cheatsheet

| Task | Command / Location |
|------|--------------------|
| CRA production build | `npm run build` → `/build` |
| Vite production build | `npm run build` → `/dist` |
| Preview build locally | `npx serve -s build` or `npm run preview` |
| Deploy to Vercel | `vercel` or push to GitHub |
| Deploy to Netlify | `netlify deploy --prod --dir=dist` |
| Deploy to GitHub Pages | `npm run deploy` |
| Fix React Router (Vercel) | `vercel.json` rewrites |
| Fix React Router (Netlify) | `netlify.toml` redirects |
| Fix React Router (GH Pages) | Use `HashRouter` or 404 redirect trick |
| CRA env variable prefix | `REACT_APP_` |
| Vite env variable prefix | `VITE_` |
| Vite env access syntax | `import.meta.env.VITE_KEY` |
| CRA env access syntax | `process.env.REACT_APP_KEY` |

---

## Common Pitfalls & Solutions

**Blank page after deploying to GitHub Pages**
→ Missing `base` in `vite.config.js` or `homepage` in CRA's `package.json`. Make sure it matches the repo name exactly.

**Routes return 404 on refresh**
→ Your host doesn't know to serve `index.html` for all routes. Add the rewrite/redirect rule for your platform (see each section above).

**Environment variables are `undefined` in production**
→ Variables must be set on the hosting platform's dashboard, not just locally. Also check the prefix: `REACT_APP_` for CRA, `VITE_` for Vite.

**Build works locally but fails in CI**
→ Run `npm ci` instead of `npm install` in CI pipelines — it uses exact versions from `package-lock.json`.

**SSL certificate errors after adding custom domain**
→ DNS propagation can take up to 48 hours. Check with `dig` or [dnschecker.org](https://dnschecker.org). If still failing, ensure no CAA DNS records are blocking Let's Encrypt.

---

*Phase 10 complete. Your React application is production-ready and deployed.* 🚀
