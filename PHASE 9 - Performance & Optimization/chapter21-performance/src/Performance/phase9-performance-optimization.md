# Phase 9: Performance & Optimization

> Master the tools and techniques to build fast, efficient React applications — from profiling re-renders to shipping smaller bundles and hitting green Lighthouse scores.

---

## Table of Contents

1. [React DevTools Profiler](#1-react-devtools-profiler)
2. [Identifying & Preventing Re-renders](#2-identifying--preventing-re-renders)
3. [Code Splitting with React.lazy](#3-code-splitting-with-reactlazy)
4. [Suspense for Lazy Loading](#4-suspense-for-lazy-loading)
5. [Bundle Size Optimization](#5-bundle-size-optimization)
6. [Web Vitals](#6-web-vitals)
7. [Lighthouse Audits](#7-lighthouse-audits)
8. [Summary & Checklist](#8-summary--checklist)

---

## 1. React DevTools Profiler

### What Is It?

The **React DevTools Profiler** is a browser extension tab that records component render timings. It tells you *which* components rendered, *why* they rendered, and *how long* each render took.

### Setup

Install the extension for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/). In production builds, profiling is disabled by default. To enable it:

```bash
# Create React App
REACT_APP_PROFILE=true npm run build

# Vite — use the react-plugin profiling build
```

Or add the profiling alias in `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },
});
```

### Using the Profiler Tab

1. Open DevTools → **Profiler** tab
2. Click ⏺ **Record**
3. Interact with your app (click buttons, type in inputs, navigate routes)
4. Click ⏹ **Stop**

You'll see a **flame chart** and a **ranked chart**:

- **Flame chart**: Visualizes the component tree per commit. Wider bars = longer render.
- **Ranked chart**: Lists every component sorted by render time — great for spotting bottlenecks.

### Reading Commit Details

Each vertical bar in the timeline is one **commit** (a batch of DOM updates). Click a bar to see:

- Which components rendered in that commit (gray = skipped/memoized ✅)
- The render duration of each component
- *Why* a component rendered (props/state/context/hooks changed)

### Programmatic Profiling with `<Profiler>`

For production monitoring or automated testing, use the built-in `<Profiler>` component:

```jsx
import { Profiler } from 'react';

function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.table({ id, phase, actualDuration, baseDuration });
  // Send to your analytics service
}

function App() {
  return (
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList />
    </Profiler>
  );
}
```

| Parameter | Description |
|---|---|
| `id` | The name you gave the `<Profiler>` |
| `phase` | `"mount"` or `"update"` |
| `actualDuration` | Time spent rendering this commit |
| `baseDuration` | Estimated time if no memoization |
| `startTime` / `commitTime` | Timestamps |

> **Tip:** `baseDuration >> actualDuration` means your memoization is working well.

---

## 2. Identifying & Preventing Re-renders

### Why Re-renders Happen

A React component re-renders when:

1. Its **state** changes
2. Its **props** change (by reference, not deep equality)
3. Its **parent** re-renders (even if props didn't change)
4. A **context** it consumes changes
5. A **hook** it uses changes its return value

### Highlight Updates in DevTools

In the **Components** tab → ⚙️ Settings → enable **"Highlight updates when components render"**. Components flash with a colored border on every render — blue for infrequent, red for frequent.

### `React.memo` — Skip Re-renders for Function Components

Wrap a component in `React.memo` to skip re-rendering when props haven't changed (shallow comparison):

```jsx
// Without memo — re-renders every time parent renders
function Avatar({ user }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}

// With memo — only re-renders if user prop changes
const Avatar = React.memo(function Avatar({ user }) {
  return <img src={user.avatarUrl} alt={user.name} />;
});
```

For custom comparison logic:

```jsx
const Avatar = React.memo(
  function Avatar({ user }) {
    return <img src={user.avatarUrl} alt={user.name} />;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
```

> ⚠️ **Don't over-memoize.** Memo has a cost — the comparison itself. Only memoize components that actually re-render unnecessarily.

### `useMemo` — Memoize Expensive Calculations

```jsx
import { useMemo } from 'react';

function ProductList({ products, filterText }) {
  // Only recomputes when products or filterText changes
  const filteredProducts = useMemo(
    () => products.filter(p => p.name.includes(filterText)),
    [products, filterText]
  );

  return <ul>{filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

**Use `useMemo` when:**
- Computation is visibly slow (sorting/filtering large arrays, complex math)
- The result is used as a prop passed to a memoized child

**Don't use `useMemo` for:**
- Simple operations like string formatting or basic arithmetic
- Primitive values (they're already cheap to compare)

### `useCallback` — Stable Function References

When you pass a function as a prop, a new function reference is created on every render — breaking `React.memo`:

```jsx
// ❌ New function on every render — memo on Button is useless
function Parent() {
  const handleClick = () => console.log('clicked');
  return <Button onClick={handleClick} />;
}

// ✅ Stable reference across renders
function Parent() {
  const handleClick = useCallback(() => console.log('clicked'), []);
  return <Button onClick={handleClick} />;
}
```

```jsx
// Realistic example with dependencies
function TodoList({ todos, onToggle }) {
  const handleToggle = useCallback(
    (id) => onToggle(id),
    [onToggle] // Re-create only when onToggle changes
  );

  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
  ));
}
```

### Avoiding Object & Array Literals in JSX

Every render creates a new object/array reference, even if the content is identical:

```jsx
// ❌ New object on every render
<Chart options={{ responsive: true }} />

// ✅ Stable reference
const CHART_OPTIONS = { responsive: true };
function MyChart() {
  return <Chart options={CHART_OPTIONS} />;
}

// ✅ Or useMemo if it depends on props/state
const options = useMemo(() => ({ responsive: true, title }), [title]);
```

### Context Optimization

When a Context value changes, **all consumers re-render**. Split contexts and memoize values to minimize this:

```jsx
// ❌ One giant context — any change re-renders everything
const AppContext = createContext();

// ✅ Split by concern
const UserContext = createContext();
const ThemeContext = createContext();

// ✅ Memoize the value object
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

---

## 3. Code Splitting with React.lazy

### The Problem: Monolithic Bundles

By default, webpack/Vite bundles your entire app into one JavaScript file. Users downloading the home page pay the cost of loading the settings page, admin dashboard, and everything else — even if they never visit those routes.

**Code splitting** breaks your bundle into smaller chunks that load on demand.

### `React.lazy` — Dynamic Imports

`React.lazy` lets you render a dynamic import as a regular component:

```jsx
import { lazy } from 'react';

// Before: static import (always in the main bundle)
// import Dashboard from './pages/Dashboard';

// After: dynamic import (separate chunk, loaded on demand)
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

The `import()` function returns a Promise. React.lazy handles the loading lifecycle for you.

### Route-Based Code Splitting

The most impactful place to split code is at the **route level**:

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home      = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));
const Admin     = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings"  element={<Settings />} />
          <Route path="/admin"     element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Component-Level Splitting

Split heavy components that aren't immediately visible:

```jsx
// Heavy chart library — don't load on initial render
const RevenueChart = lazy(() => import('./components/RevenueChart'));
const VideoPlayer  = lazy(() => import('./components/VideoPlayer'));
const RichEditor   = lazy(() => import('./components/RichEditor'));

function ReportPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Revenue Chart</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      )}
    </div>
  );
}
```

### Named Exports with lazy

`React.lazy` only works with default exports. For named exports, re-export as default:

```jsx
// Solution 1: Create a wrapper file
// LazyUserCard.js
export { UserCard as default } from './components/UserCard';

// Solution 2: Use an inline wrapper
const UserCard = lazy(() =>
  import('./components/UserCard').then(module => ({ default: module.UserCard }))
);
```

### Prefetching Chunks

Prefetch a chunk before the user navigates to it using webpack magic comments:

```jsx
const Dashboard = lazy(() =>
  import(/* webpackPrefetch: true */ './pages/Dashboard')
);
```

This adds a `<link rel="prefetch">` tag that loads the chunk during idle time.

For Vite, use `vite-plugin-warmup` or manual link injection.

---

## 4. Suspense for Lazy Loading

### What Is Suspense?

`<Suspense>` catches components that are "not ready yet" — whether they're lazy-loaded chunks or async data — and shows a fallback UI in the meantime.

```jsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### Fallback Design Patterns

The fallback should match the *shape* of the content to prevent layout shift:

```jsx
// ❌ Generic spinner — causes layout shift
<Suspense fallback={<div>Loading...</div>}>
  <UserProfile />
</Suspense>

// ✅ Skeleton that matches the component layout
<Suspense fallback={<UserProfileSkeleton />}>
  <UserProfile />
</Suspense>
```

**Skeleton component example:**

```jsx
function UserProfileSkeleton() {
  return (
    <div className="profile-skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-name" />
      <div className="skeleton-bio" />
    </div>
  );
}
```

```css
.skeleton-avatar, .skeleton-name, .skeleton-bio {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Nested Suspense Boundaries

You can nest `<Suspense>` boundaries for granular loading states:

```jsx
function DashboardPage() {
  return (
    <div>
      {/* Header loads fast — own boundary */}
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <div className="grid">
        {/* Each widget has its own loading state */}
        <Suspense fallback={<WidgetSkeleton />}>
          <RevenueWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <UsersWidget />
        </Suspense>
      </div>
    </div>
  );
}
```

### Error Boundaries with Suspense

Network failures will reject the lazy import's Promise. Wrap `<Suspense>` with an **Error Boundary** to handle this gracefully:

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Failed to load. <button onClick={() => this.setState({ hasError: false })}>Retry</button></p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <LazyDashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

Or use the popular [`react-error-boundary`](https://www.npmjs.com/package/react-error-boundary) library for a hooks-friendly API.

### Suspense with Data Fetching (React 18+)

With React 18, Suspense works with data fetching libraries like SWR and React Query:

```jsx
import useSWR from 'swr';

// SWR with suspense mode
function UserProfile({ userId }) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher, { suspense: true });
  return <div>{user.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

---

## 5. Bundle Size Optimization

### Analyze Your Bundle First

Never optimize blindly. Measure first with a bundle analyzer:

```bash
# For Create React App
npm install --save-dev source-map-explorer
npx source-map-explorer 'build/static/js/*.js'

# For Vite
npm install --save-dev rollup-plugin-visualizer
```

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true, gzipSize: true, brotliSize: true })
  ]
};
```

```bash
npm run build
# Opens an interactive treemap of your bundle
```

### Tree Shaking

Tree shaking removes unused exports. It only works with **ES module syntax** (`import`/`export`):

```jsx
// ❌ Imports entire lodash (~72 KB gzipped)
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Imports only debounce (~2 KB)
import debounce from 'lodash/debounce';

// ✅ Or use lodash-es (full tree-shaking support)
import { debounce } from 'lodash-es';
```

```jsx
// ❌ Imports all of date-fns
import * as dateFns from 'date-fns';

// ✅ Only imports format
import { format } from 'date-fns';
```

### Replace Heavy Dependencies

| Heavy Library | Lightweight Alternative | Savings |
|---|---|---|
| `moment.js` (~67KB gz) | `date-fns` or `dayjs` | ~60KB |
| `lodash` (~72KB gz) | `lodash-es` + tree shake | ~60KB |
| `axios` (~13KB gz) | native `fetch` | ~13KB |
| `react-icons` (all) | `react-icons/<pack>` (specific) | varies |

Check [bundlephobia.com](https://bundlephobia.com) before installing any package.

### Dynamic Imports for Conditional Features

```jsx
// ❌ PDF library always in bundle
import { generatePDF } from './pdfGenerator';

function ReportPage() {
  return <button onClick={() => generatePDF(data)}>Export PDF</button>;
}

// ✅ Load PDF library only when user clicks Export
function ReportPage() {
  const handleExport = async () => {
    const { generatePDF } = await import('./pdfGenerator');
    generatePDF(data);
  };

  return <button onClick={handleExport}>Export PDF</button>;
}
```

### Externalize Large Libraries (CDN)

Move rarely-changing, large libraries to a CDN and mark them as externals:

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
};
```

```html
<!-- index.html -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

### Image Optimization

Images are often the biggest contributor to page weight:

```jsx
// Use next-gen formats
// WebP is ~30% smaller than JPEG, AVIF is ~50% smaller

// Use responsive images
<img
  src="hero-800w.webp"
  srcSet="hero-400w.webp 400w, hero-800w.webp 800w, hero-1200w.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  loading="lazy"   // Native lazy loading
  decoding="async"
  alt="Hero image"
/>
```

### Compression & Caching Headers

Enable Brotli/gzip compression on your server. Typical savings:

- JS: ~70–80% smaller
- CSS: ~60–70% smaller
- HTML: ~50–60% smaller

```nginx
# nginx.conf
gzip on;
gzip_types text/javascript application/javascript text/css;
brotli on;
brotli_types text/javascript application/javascript text/css;

# Long-lived cache for hashed assets
location /static/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## 6. Web Vitals

Web Vitals are Google's standardized metrics for measuring real-world user experience. They directly influence SEO rankings.

### The Core Web Vitals

#### LCP — Largest Contentful Paint
**Measures: Loading performance**
> How long until the largest visible element (hero image, heading) is rendered?

| Score | Threshold |
|---|---|
| ✅ Good | ≤ 2.5s |
| ⚠️ Needs Improvement | 2.5s – 4.0s |
| ❌ Poor | > 4.0s |

**Common causes & fixes:**
- Slow server response → use CDN, optimize TTFB
- Render-blocking resources → defer/async scripts, preload critical CSS
- Large images → optimize format/size, add `loading="eager"` + preload for hero images

#### INP — Interaction to Next Paint *(replaced FID in 2024)*
**Measures: Interactivity responsiveness**
> How quickly does the page respond visually after user input (click, tap, keypress)?

| Score | Threshold |
|---|---|
| ✅ Good | ≤ 200ms |
| ⚠️ Needs Improvement | 200ms – 500ms |
| ❌ Poor | > 500ms |

**Common causes & fixes:**
- Long JavaScript tasks → break up with `scheduler.yield()` or `setTimeout`
- Expensive event handlers → debounce, memoize, move work off main thread
- Heavy re-renders → apply `React.memo`, `useMemo`, `useCallback`

#### CLS — Cumulative Layout Shift
**Measures: Visual stability**
> How much does content unexpectedly move around as the page loads?

| Score | Threshold |
|---|---|
| ✅ Good | ≤ 0.1 |
| ⚠️ Needs Improvement | 0.1 – 0.25 |
| ❌ Poor | > 0.25 |

**Common causes & fixes:**
- Images without dimensions → always set `width` and `height` attributes
- Dynamically injected content → reserve space with min-height
- Web fonts causing FOUT → use `font-display: optional` or preload fonts

### Measuring Web Vitals in React

```bash
npm install web-vitals
```

```jsx
// reportWebVitals.js
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, rating, id }) {
  // Send to your analytics endpoint
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, value, rating, id }),
  });

  // Or log during development
  console.log(`${name}: ${Math.round(value)}ms — ${rating}`);
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

```jsx
// index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { reportWebVitals } from './reportWebVitals';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

reportWebVitals();
```

### Additional Vitals to Monitor

| Metric | Full Name | What It Measures |
|---|---|---|
| FCP | First Contentful Paint | When first text/image is painted |
| TTFB | Time to First Byte | Server response time |
| FID | First Input Delay | *(deprecated, replaced by INP)* |

### Improving INP with `useTransition`

React 18's `useTransition` marks state updates as non-urgent, keeping the UI responsive:

```jsx
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    setQuery(e.target.value); // Urgent: update input immediately

    startTransition(() => {
      // Non-urgent: heavy filtering doesn't block the input
      setResults(filterLargeDataset(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </>
  );
}
```

---

## 7. Lighthouse Audits

### What Is Lighthouse?

Lighthouse is an automated auditing tool built into Chrome DevTools. It scores your app across 5 categories (0–100) and provides actionable recommendations.

| Category | What It Checks |
|---|---|
| **Performance** | Loading speed, Web Vitals, render blocking |
| **Accessibility** | ARIA, color contrast, keyboard nav |
| **Best Practices** | HTTPS, console errors, deprecated APIs |
| **SEO** | Meta tags, crawlability, mobile-friendly |
| **PWA** | Service workers, offline support, installability |

### Running a Lighthouse Audit

**In Chrome DevTools:**
1. Open DevTools → **Lighthouse** tab
2. Select categories and device (Mobile is stricter — use it)
3. Click **Analyze page load**

> ⚠️ **Always audit in Incognito mode** to avoid extension interference. Audit your **production build**, not the dev server.

**From the CLI:**

```bash
npm install -g lighthouse

# Basic audit
lighthouse https://yourapp.com --view

# Audit with specific categories, mobile simulation
lighthouse https://yourapp.com \
  --only-categories=performance,accessibility \
  --emulated-form-factor=mobile \
  --view

# Output as JSON for CI
lighthouse https://yourapp.com \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"
```

### Lighthouse CI in GitHub Actions

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/dashboard
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "interactive",           "budget": 3000 },
      { "metric": "first-contentful-paint","budget": 1500 }
    ],
    "resourceSizes": [
      { "resourceType": "script",  "budget": 300 },
      { "resourceType": "image",   "budget": 500 },
      { "resourceType": "total",   "budget": 1000 }
    ]
  }
]
```

### Common Lighthouse Recommendations & Fixes

#### "Eliminate render-blocking resources"
```html
<!-- ❌ Blocks parsing -->
<script src="analytics.js"></script>
<link rel="stylesheet" href="non-critical.css">

<!-- ✅ Non-blocking -->
<script src="analytics.js" defer></script>
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
```

#### "Properly size images"
```html
<!-- Serve images at the right size for the display size -->
<img
  srcSet="img-320.webp 320w, img-640.webp 640w, img-1280.webp 1280w"
  sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px"
  src="img-640.webp"
  alt="..."
/>
```

#### "Reduce unused JavaScript"
- Apply route-based code splitting (Section 3)
- Remove unused npm packages
- Use tree-shaking-friendly imports

#### "Enable text compression"
- Configure Brotli/gzip on your server/CDN (Section 5)

#### "Avoid enormous network payloads"
- Total page weight should be under 1.6 MB (Lighthouse budget)
- Lazy load images with `loading="lazy"`
- Code split and defer non-critical JS

#### "Serve static assets with an efficient cache policy"
- Set `Cache-Control: max-age=31536000, immutable` for hashed filenames
- Use `no-cache` for `index.html` so updates deploy immediately

### Accessibility Quick Wins for Lighthouse Score

```jsx
// Always provide alt text
<img src="chart.png" alt="Revenue increased 23% in Q3" />

// Use semantic HTML
<button onClick={handleClick}>Save</button>  // ✅ not <div onClick>
<nav>, <main>, <aside>, <footer>             // ✅ landmark elements

// Ensure sufficient color contrast (4.5:1 ratio for normal text)
// ARIA labels for icon-only buttons
<button aria-label="Close dialog">✕</button>

// Associate labels with inputs
<label htmlFor="email">Email address</label>
<input id="email" type="email" />
```

---

## 8. Summary & Checklist

### Performance Optimization Checklist

**Profiling & Re-renders**
- [ ] Installed React DevTools and profiled the app
- [ ] Identified and fixed unnecessary re-renders with `React.memo`
- [ ] Used `useMemo` for expensive computations
- [ ] Used `useCallback` for stable function references
- [ ] Split large Context into smaller, focused contexts

**Code Splitting & Lazy Loading**
- [ ] Implemented route-based code splitting with `React.lazy`
- [ ] Added `<Suspense>` boundaries with meaningful skeleton fallbacks
- [ ] Wrapped lazy boundaries in Error Boundaries
- [ ] Lazy-loaded heavy UI components (charts, editors, etc.)
- [ ] Used prefetching for likely next navigations

**Bundle Optimization**
- [ ] Analyzed bundle with visualizer (no surprise large dependencies)
- [ ] Replaced heavy libraries with lightweight alternatives
- [ ] Used specific imports (not `import _ from 'lodash'`)
- [ ] Enabled Brotli/gzip compression on server
- [ ] Set proper cache headers for static assets
- [ ] Optimized images (WebP/AVIF, responsive srcSet, lazy loading)

**Web Vitals & Lighthouse**
- [ ] Integrated `web-vitals` library and sending data to analytics
- [ ] LCP ≤ 2.5s
- [ ] INP ≤ 200ms
- [ ] CLS ≤ 0.1
- [ ] Lighthouse Performance score ≥ 90 (mobile)
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse CI running in CI/CD pipeline

### Key Mental Models

**Measure first, optimize second.** Don't guess — use the Profiler and bundle analyzer to find real bottlenecks before writing optimization code.

**The cost of optimization is complexity.** `useMemo` and `useCallback` add code that must be maintained. Only add them when you've measured an actual performance problem.

**The network is the biggest bottleneck.** Optimizing re-renders saves milliseconds. Fixing a 500KB unnecessary bundle saves seconds. Always prioritize bundle size and network performance over micro-optimizations.

**Use the platform.** Many "React optimizations" are actually just good web fundamentals: proper caching, image optimization, compression, and semantic HTML.

---

*Next up: Phase 10 — Testing (Unit, Integration, E2E)*
