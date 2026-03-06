# React Phase 10: Production & Deployment Best Practices

> A complete guide to building production-ready React applications — covering error boundaries, logging, analytics, Progressive Web Apps, and service workers.

---

## Table of Contents

1. [Error Boundaries](#1-error-boundaries)
2. [Logging and Monitoring](#2-logging-and-monitoring)
3. [Analytics Integration](#3-analytics-integration)
4. [Progressive Web App Basics](#4-progressive-web-app-basics)
5. [Service Workers Introduction](#5-service-workers-introduction)
6. [Putting It All Together](#6-putting-it-all-together)
7. [Checklist: Production Readiness](#7-checklist-production-readiness)

---

## 1. Error Boundaries

### What Are Error Boundaries?

In React, a JavaScript error in a component tree can break the entire UI. **Error Boundaries** are React class components that catch errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the app.

Error boundaries catch errors during:
- Rendering
- Lifecycle methods
- Constructors of child components

> ⚠️ Error boundaries do **not** catch errors inside event handlers, async code (e.g., `setTimeout`), or server-side rendering.

---

### Creating a Basic Error Boundary

```jsx
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // Called when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after an error has been thrown — use for logging
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log the error to an external service (see Section 2)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

### Using an Error Boundary

Wrap any part of your component tree — or the whole app:

```jsx
// App.jsx
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
```

You can also use **granular** error boundaries to isolate failures:

```jsx
function Dashboard() {
  return (
    <div>
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
    </div>
  );
}
```

This way, if `Sidebar` crashes, `MainContent` still renders.

---

### Reusable Error Boundary with Custom Fallbacks

```jsx
// components/ErrorBoundary.jsx (enhanced)
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Pass to external logger (covered in Section 2)
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise default UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () =>
          this.setState({ hasError: false, error: null })
        );
      }
      return <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

// Usage with custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
  onError={(error, info) => logToService(error, info)}
>
  <MyComponent />
</ErrorBoundary>
```

---

### Using `react-error-boundary` (Recommended Library)

For production apps, use the well-tested `react-error-boundary` package:

```bash
npm install react-error-boundary
```

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, info) => console.error(error, info)}
      onReset={() => {
        // Optionally reset state when user tries again
      }}
    >
      <MyApp />
    </ErrorBoundary>
  );
}
```

---

## 2. Logging and Monitoring

### Why Logging Matters in Production

`console.log` disappears when the browser tab closes. In production, you need **persistent, searchable logs** to diagnose errors your users experience — often without ever contacting support.

---

### Levels of Logging

| Level   | When to Use                              |
|---------|------------------------------------------|
| `debug` | Verbose info, dev-only                   |
| `info`  | Normal flow, key events                  |
| `warn`  | Something unexpected but not fatal       |
| `error` | Failures that affect the user            |

---

### Creating a Custom Logger Utility

```js
// utils/logger.js

const isDev = process.env.NODE_ENV === 'development';

const logger = {
  debug: (...args) => {
    if (isDev) console.debug('[DEBUG]', ...args);
  },
  info: (...args) => {
    if (isDev) console.info('[INFO]', ...args);
    // In production, send to a monitoring service
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
    sendToMonitoring('warn', args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
    sendToMonitoring('error', args);
  },
};

function sendToMonitoring(level, args) {
  if (process.env.NODE_ENV === 'production') {
    // Integration point — see Sentry/LogRocket below
    console.log(`[Monitoring] ${level}:`, args);
  }
}

export default logger;
```

---

### Integrating Sentry (Industry Standard)

[Sentry](https://sentry.io) is the most widely-used error monitoring tool for React apps.

```bash
npm install @sentry/react @sentry/tracing
```

**Initialize Sentry early in your app (before React renders):**

```js
// main.jsx or index.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE', // Get from sentry.io dashboard
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // 100% of transactions (reduce in high-traffic apps)
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION, // Track which release has the error
});
```

**Use Sentry's built-in Error Boundary:**

```jsx
import * as Sentry from '@sentry/react';

const SentryErrorBoundary = Sentry.withErrorBoundary(MyComponent, {
  fallback: <p>An error has occurred.</p>,
  showDialog: true, // Optional: shows a user feedback form
});
```

**Capture errors and add context manually:**

```js
import * as Sentry from '@sentry/react';

// Capture a specific error
try {
  doSomethingRisky();
} catch (error) {
  Sentry.captureException(error);
}

// Add user context (e.g., after login)
Sentry.setUser({ id: user.id, email: user.email });

// Add custom tags
Sentry.setTag('page', 'checkout');

// Capture a message (non-error)
Sentry.captureMessage('User reached payment step');
```

---

### Performance Monitoring with Web Vitals

React's `create-react-app` template includes `reportWebVitals`:

```js
// index.js
import reportWebVitals from './reportWebVitals';

reportWebVitals((metric) => {
  // Send to analytics or monitoring service
  console.log(metric);
  // Example: send to Google Analytics
  // gtag('event', metric.name, { value: metric.value });
});
```

The key Web Vitals metrics are:

| Metric | Measures | Good Threshold |
|--------|----------|----------------|
| LCP | Largest Contentful Paint (load speed) | < 2.5s |
| FID | First Input Delay (interactivity) | < 100ms |
| CLS | Cumulative Layout Shift (visual stability) | < 0.1 |
| TTFB | Time to First Byte (server speed) | < 800ms |

---

## 3. Analytics Integration

### What to Track

Good analytics answers questions like:
- Which features are actually used?
- Where do users drop off in a funnel?
- What device/browser/location do most users have?

---

### Google Analytics 4 (GA4)

**Install the library:**

```bash
npm install react-ga4
```

**Initialize and configure:**

```js
// utils/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Your GA4 Measurement ID
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({ category, action, label });
};
```

**Track page views with React Router:**

```jsx
// App.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from './utils/analytics';

initGA(); // Call once on startup

function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <Routes />;
}
```

**Track custom events:**

```jsx
// In any component
import { trackEvent } from '../utils/analytics';

function CheckoutButton() {
  const handleClick = () => {
    trackEvent('Ecommerce', 'click_checkout', 'Cart Page');
    // ... proceed with checkout
  };

  return <button onClick={handleClick}>Checkout</button>;
}
```

---

### Creating a Custom Analytics Hook

```js
// hooks/useAnalytics.js
import { useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

export function useAnalytics(category) {
  const track = useCallback(
    (action, label) => {
      trackEvent(category, action, label);
    },
    [category]
  );

  return { track };
}

// Usage in component
function ProductPage({ product }) {
  const { track } = useAnalytics('Product');

  return (
    <button onClick={() => track('add_to_cart', product.name)}>
      Add to Cart
    </button>
  );
}
```

---

### Privacy & GDPR Considerations

Always be mindful of user privacy:

```js
// Only initialize analytics after user consent
function CookieConsent({ onAccept, onDecline }) {
  return (
    <div className="cookie-banner">
      <p>We use analytics to improve your experience.</p>
      <button onClick={onAccept}>Accept</button>
      <button onClick={onDecline}>Decline</button>
    </div>
  );
}

// In App.jsx
const [analyticsEnabled, setAnalyticsEnabled] = useState(
  localStorage.getItem('analytics_consent') === 'true'
);

const handleAccept = () => {
  localStorage.setItem('analytics_consent', 'true');
  setAnalyticsEnabled(true);
  initGA(); // Only now initialize tracking
};
```

---

## 4. Progressive Web App Basics

### What Is a PWA?

A **Progressive Web App (PWA)** is a web application that uses modern browser APIs to deliver app-like experiences. PWAs are:

- **Installable** — added to the home screen like a native app
- **Offline-capable** — work without an internet connection
- **Fast** — cached resources load instantly
- **Secure** — must be served over HTTPS

---

### The Three Pillars of a PWA

```
PWA
├── 1. Web App Manifest     ← Defines name, icons, display mode
├── 2. Service Worker       ← Handles caching and offline (Section 5)
└── 3. HTTPS                ← Required for service workers
```

---

### Web App Manifest

The manifest is a JSON file that tells the browser how to display your app when installed.

**Create `public/manifest.json`:**

```json
{
  "name": "My Awesome React App",
  "short_name": "AwesomeApp",
  "description": "A production-ready React application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

**Link the manifest in `public/index.html`:**

```html
<head>
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <meta name="theme-color" content="#3b82f6" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/icons/icon-192x192.png" />
</head>
```

---

### Display Modes

| Mode | Behavior |
|------|----------|
| `standalone` | App-like, no browser UI (most common) |
| `fullscreen` | Takes entire screen (games, video) |
| `minimal-ui` | Browser controls visible but minimal |
| `browser` | Regular browser tab (defeats PWA purpose) |

---

### Install Prompt (Add to Home Screen)

React to the browser's install prompt:

```jsx
// hooks/useInstallPrompt.js
import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    return outcome; // 'accepted' or 'dismissed'
  };

  return { canInstall: !!installPrompt, isInstalled, triggerInstall };
}

// Usage in any component
function InstallButton() {
  const { canInstall, triggerInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button onClick={triggerInstall}>
      📲 Install App
    </button>
  );
}
```

---

### Detecting Network Status

```jsx
// hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}

// Usage
function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div style={{ background: '#fbbf24', padding: '0.5rem', textAlign: 'center' }}>
      ⚠️ You are offline. Some features may be unavailable.
    </div>
  );
}
```

---

## 5. Service Workers Introduction

### What Is a Service Worker?

A **service worker** is a JavaScript file that runs in the background — separate from your web page — acting as a programmable network proxy. It sits between your app and the network, intercepting requests and enabling:

- **Offline support** — serve cached content when there's no network
- **Background sync** — retry failed requests when connectivity returns
- **Push notifications** — receive messages even when the app is closed
- **Pre-caching** — store assets during install for instant loads

```
Browser Tab  ←→  Service Worker  ←→  Network
                       ↕
                    Cache API
```

---

### Service Worker Lifecycle

```
Register → Install → Activate → Fetch (intercept requests)
              ↓           ↓
          Cache files  Clean old caches
```

1. **Registration** — Your app tells the browser about the SW file
2. **Installation** — SW runs `install` event, typically caches static assets
3. **Activation** — SW takes control, often cleans up old caches
4. **Fetch** — SW intercepts all network requests from the page

---

### Enabling the Service Worker in Create React App

CRA ships with a service worker via Workbox. It's **opt-in**:

```js
// index.js (CRA default — change serviceWorker.unregister to register)
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Change this:
serviceWorkerRegistration.unregister();

// To this:
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('Service Worker registered:', registration);
  },
  onUpdate: (registration) => {
    console.log('New content available! Refresh to update.');
    // Optionally prompt the user to refresh
  },
});
```

> ℹ️ The generated service worker uses **Workbox** under the hood and automatically pre-caches your build assets.

---

### Writing a Custom Service Worker

For full control, write your own `service-worker.js` in the `public/` folder:

```js
// public/service-worker.js

const CACHE_NAME = 'my-app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/icons/icon-192x192.png',
];

// INSTALL — cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// ACTIVATE — clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// FETCH — serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // Serve from cache
      }
      return fetch(event.request).then((response) => {
        // Optionally cache new responses dynamically
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
```

---

### Caching Strategies

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| **Cache First** | Serve cache, fall back to network | Static assets (JS, CSS, images) |
| **Network First** | Try network, fall back to cache | API calls, frequently updated data |
| **Stale While Revalidate** | Serve cache immediately, update in background | User-facing pages |
| **Cache Only** | Always serve from cache | Pre-cached offline content |
| **Network Only** | Never cache | Sensitive/real-time data |

**Example — Network First for API calls:**

```js
self.addEventListener('fetch', (event) => {
  // Only apply to API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the successful response
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Network failed — serve stale cache
          return caches.match(event.request);
        })
    );
  }
});
```

---

### Using Workbox (Recommended)

[Workbox](https://developer.chrome.com/docs/workbox/) is Google's library that simplifies service worker patterns:

```bash
npm install workbox-webpack-plugin workbox-strategies workbox-routing
```

```js
// service-worker.js (with Workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Pre-cache build assets automatically
precacheAndRoute(self.__WB_MANIFEST);

// Cache Google Fonts (Cache First, 1 year)
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);

// API calls (Network First, 5 minute cache)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 5, maxEntries: 50 })],
  })
);

// Images (Stale While Revalidate)
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'images' })
);
```

---

### Notifying Users of Updates

When a new service worker is waiting, prompt users to refresh:

```jsx
// hooks/useServiceWorker.js
import { useState, useEffect } from 'react';

export function useServiceWorker() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
              setShowReload(true);
            }
          });
        });
      });
    }
  }, []);

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowReload(false);
      window.location.reload();
    }
  };

  return { showReload, reloadPage };
}

// Update Banner Component
function UpdateBanner() {
  const { showReload, reloadPage } = useServiceWorker();

  if (!showReload) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      background: '#1e40af', color: 'white', padding: '12px 24px',
      borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <span>🆕 A new version is available!</span>
      <button
        onClick={reloadPage}
        style={{ background: 'white', color: '#1e40af', border: 'none',
          borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
      >
        Refresh
      </button>
    </div>
  );
}
```

---

## 6. Putting It All Together

### Complete Production Setup Checklist

Here's how all five concepts integrate in a real app:

```jsx
// main.jsx — Production entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import { initGA } from './utils/analytics';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// 1. Initialize monitoring (before render)
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// 2. Initialize analytics
if (localStorage.getItem('analytics_consent') === 'true') {
  initGA();
}

// 3. Render app with error boundary
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// 4. Register service worker for offline support + caching
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Handled by UpdateBanner component
    console.log('App update available');
  },
});
```

```jsx
// App.jsx — App shell
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
import OfflineBanner from './components/OfflineBanner';
import UpdateBanner from './components/UpdateBanner';
import InstallButton from './components/InstallButton';
import ErrorBoundary from './components/ErrorBoundary';
import Router from './Router';

function App() {
  const location = useLocation();

  // Auto-track all page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <>
      <OfflineBanner />
      <UpdateBanner />
      <header>
        <nav>{/* ... */}</nav>
        <InstallButton />
      </header>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </>
  );
}
```

---

## 7. Checklist: Production Readiness

Use this checklist before deploying any React app to production:

### Error Boundaries
- [ ] Root-level error boundary wrapping the entire app
- [ ] Granular error boundaries around high-risk components (async data, third-party widgets)
- [ ] Fallback UI that is user-friendly, not a blank screen
- [ ] Errors reported to an external monitoring service (Sentry, etc.)

### Logging & Monitoring
- [ ] Sentry (or equivalent) configured with your DSN
- [ ] `environment` and `release` set in Sentry config
- [ ] User context set after authentication
- [ ] Web Vitals reported (LCP, FID, CLS, TTFB)
- [ ] Console.log statements removed or suppressed in production

### Analytics
- [ ] GA4 or analytics provider initialized
- [ ] Page views tracked automatically with routing changes
- [ ] Key user events tracked (sign-up, purchase, error states)
- [ ] Consent banner implemented if operating in GDPR regions

### Progressive Web App
- [ ] `manifest.json` complete with name, icons, theme color
- [ ] Icons provided at 192×192 and 512×512 (at minimum)
- [ ] App served over **HTTPS**
- [ ] `<meta name="theme-color">` set in HTML head
- [ ] Apple touch icon included for iOS
- [ ] App passes [Lighthouse PWA audit](https://developer.chrome.com/docs/lighthouse)

### Service Workers
- [ ] Service worker registered (not `unregister()`)
- [ ] Static assets pre-cached during install
- [ ] Appropriate caching strategy per resource type
- [ ] Old caches cleaned up on activate
- [ ] Update notification shown when new SW is waiting
- [ ] Offline fallback page or message displayed

### General Production
- [ ] `process.env.NODE_ENV === 'production'` build
- [ ] Source maps configured (upload to Sentry, not public)
- [ ] Bundle size audited (`npm run build` → Check sizes)
- [ ] Environment variables in `.env.production` (never commit secrets)
- [ ] `robots.txt` configured appropriately

---

## Further Reading

| Topic | Resource |
|-------|----------|
| Error Boundaries | [React Docs — Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) |
| Sentry for React | [Sentry React SDK Docs](https://docs.sentry.io/platforms/javascript/guides/react/) |
| Web Vitals | [web.dev/vitals](https://web.dev/vitals/) |
| PWA Checklist | [web.dev/pwa-checklist](https://web.dev/pwa-checklist/) |
| Workbox | [developer.chrome.com/docs/workbox](https://developer.chrome.com/docs/workbox/) |
| Service Worker API | [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) |

---

*Phase 10 Complete — Your React app is now production-ready. 🚀*
