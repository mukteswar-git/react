# Phase 9: Performance & Optimization Best Practices in React

> A comprehensive guide to writing fast, accessible, and production-ready React applications.

---

## Table of Contents

1. [Component Composition](#1-component-composition)
2. [Avoiding Prop Drilling](#2-avoiding-prop-drilling)
3. [Key Prop Best Practices](#3-key-prop-best-practices)
4. [Error Boundaries](#4-error-boundaries)
5. [Accessibility (a11y)](#5-accessibility-a11y)
6. [SEO Considerations](#6-seo-considerations)

---

## 1. Component Composition

Component composition is the art of building complex UIs from small, focused, reusable pieces. It is the foundation of scalable React architecture.

### Why Composition Over Inheritance?

React favors composition over class inheritance. Rather than extending a base component, you build flexible components by combining smaller ones — making code easier to test, reuse, and reason about.

### The Children Pattern

The simplest form of composition is the `children` prop.

```jsx
// A reusable Card wrapper — it doesn't care what's inside
function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

// Usage — compose freely
function UserProfile({ user }) {
  return (
    <Card className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </Card>
  );
}
```

### Slot Pattern (Named Children)

For layouts with multiple content regions, use named props as "slots":

```jsx
function PageLayout({ header, sidebar, main, footer }) {
  return (
    <div className="page-layout">
      <header className="page-header">{header}</header>
      <div className="page-body">
        <aside className="sidebar">{sidebar}</aside>
        <main className="main-content">{main}</main>
      </div>
      <footer className="page-footer">{footer}</footer>
    </div>
  );
}

// Usage
function App() {
  return (
    <PageLayout
      header={<NavBar />}
      sidebar={<SideMenu />}
      main={<ArticleList />}
      footer={<FooterLinks />}
    />
  );
}
```

### Compound Components

Compound components share implicit state through context, creating expressive, declarative APIs:

```jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist" className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === id;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab ${isActive ? 'tab--active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage — clean, readable API
function App() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="profile"><ProfileView /></Tabs.Panel>
      <Tabs.Panel id="settings"><SettingsView /></Tabs.Panel>
    </Tabs>
  );
}
```

### Render Props Pattern

Pass a function as a prop to share logic while delegating rendering:

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => <p>Mouse is at ({x}, {y})</p>}
/>
```

### Higher-Order Components (HOC)

HOCs wrap a component to inject behavior or data:

```jsx
function withLogging(WrappedComponent, componentName) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(`[${componentName}] mounted`);
      return () => console.log(`[${componentName}] unmounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

const LoggedButton = withLogging(Button, 'Button');
```

> **Modern Preference:** Prefer custom hooks over HOCs and render props for logic reuse — they are simpler and avoid wrapper hell in the component tree.

### Performance: Memoization

Prevent unnecessary re-renders with `React.memo`, `useMemo`, and `useCallback`:

```jsx
// React.memo — skip re-render if props haven't changed
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  // useCallback — stable reference so ExpensiveList doesn't re-render
  const handleItemClick = useCallback((id) => {
    console.log('clicked', id);
  }, []); // dependencies array

  // useMemo — expensive computation cached
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={sortedItems} onItemClick={handleItemClick} />
    </>
  );
}
```

> **Warning:** Don't over-memoize. Memoization has its own cost. Profile first with React DevTools before optimizing.

---

## 2. Avoiding Prop Drilling

**Prop drilling** occurs when you pass props through many layers of components that don't use the data themselves — they only pass it down. This creates tight coupling and makes refactoring painful.

### Example of Prop Drilling (Problem)

```jsx
// ❌ theme is drilled through App → Layout → Sidebar → UserCard
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {
  return <UserCard theme={theme} setTheme={setTheme} />;
}

function UserCard({ theme, setTheme }) {
  return (
    <div className={`card card--${theme}`}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Solution 1: React Context API

For truly global data (theme, auth, locale), Context is the right tool:

```jsx
import { createContext, useContext, useState, useCallback } from 'react';

// 1. Create context with a meaningful default
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// 2. Create a provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create a custom hook for clean consumption
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// 4. Wrap your app
function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

// 5. Consume anywhere — no drilling!
function UserCard() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`card card--${theme}`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Solution 2: Component Composition (lift & compose)

Sometimes you can eliminate drilling by restructuring. Pass the consuming component down directly:

```jsx
// ✅ Pass the element, not the data
function App() {
  const [theme, setTheme] = useState('light');

  // UserCard lives here — it has direct access to theme
  const userCard = (
    <UserCard
      theme={theme}
      onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    />
  );

  return <Layout sidebar={userCard} />;
}

// Layout doesn't know about theme at all
function Layout({ sidebar }) {
  return <aside className="sidebar">{sidebar}</aside>;
}
```

### Solution 3: State Management Libraries

For complex global state, consider dedicated libraries:

```jsx
// Zustand — lightweight and ergonomic
import { create } from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  user: null,
  toggleTheme: () => set(state => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  setUser: (user) => set({ user }),
}));

// Any component can consume directly
function UserCard() {
  const { theme, toggleTheme } = useStore();
  return (
    <div className={`card card--${theme}`}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### When to Use What

| Situation | Solution |
|---|---|
| 1–2 levels deep | Just pass props |
| Global UI state (theme, locale) | React Context |
| Complex shared state / multiple consumers | Zustand, Redux Toolkit, Jotai |
| Component layout concerns | Component composition |

---

## 3. Key Prop Best Practices

The `key` prop helps React identify which items in a list have changed, been added, or removed. Getting it wrong causes subtle, hard-to-debug bugs.

### The Golden Rule: Keys Must Be Stable, Unique, and Consistent

```jsx
// ✅ Stable, unique ID from data
const items = [
  { id: 'usr_001', name: 'Alice' },
  { id: 'usr_002', name: 'Bob' },
];

function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### ❌ Never Use Array Index as Key (when list can change)

```jsx
// ❌ BAD — index changes when items are reordered/deleted
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// ✅ GOOD — stable identity
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}
```

**Why index keys are dangerous:**

```jsx
// Imagine this list with index keys:
// index 0 → Alice (key="0")
// index 1 → Bob   (key="1")
// index 2 → Carol (key="2")

// Delete Alice. React sees:
// index 0 → Bob   (key="0") ← React THINKS this is still Alice
// index 1 → Carol (key="1") ← React THINKS this is still Bob

// Result: state (inputs, focus, animations) is WRONG
```

### When Index Keys Are Acceptable

Index keys are safe when ALL of the following are true:
- The list is **static** (never reordered or filtered)
- Items have **no state** (pure display)
- Items are **never deleted** from the middle

```jsx
// ✅ Safe with index — static, stateless nav links
const navLinks = ['Home', 'About', 'Contact'];
navLinks.map((link, i) => <NavLink key={i} label={link} />);
```

### Generating Stable Keys Without IDs

When your data doesn't have IDs:

```jsx
// Option 1: Use a unique combination of fields
key={`${user.email}-${user.createdAt}`}

// Option 2: Generate IDs when creating data (not during render!)
import { nanoid } from 'nanoid';

function addTodo(text) {
  setTodos(prev => [...prev, { id: nanoid(), text, done: false }]);
}

// Option 3: crypto.randomUUID() (modern browsers)
const id = crypto.randomUUID();
```

### Keys Must Be Unique Among Siblings Only

```jsx
// ✅ Fine — keys are scoped per list
function App() {
  return (
    <>
      <ul>
        {cats.map(cat => <li key={cat.id}>{cat.name}</li>)}
      </ul>
      <ul>
        {dogs.map(dog => <li key={dog.id}>{dog.name}</li>)}
        {/* dog.id can overlap with cat.id — different lists */}
      </ul>
    </>
  );
}
```

### Using Keys to Force Component Reset

A powerful pattern: changing the `key` forces React to **unmount and remount** the component, resetting all its state:

```jsx
function UserForm({ userId }) {
  // When userId changes, the form FULLY resets (no stale state)
  return <Form key={userId} />;
}

// Useful for:
// - Resetting form state when switching records
// - Restarting animations
// - Clearing local component state on route change
```

---

## 4. Error Boundaries

JavaScript errors in component rendering can crash the entire React tree. **Error Boundaries** are React components that catch errors in their child tree and display a fallback UI instead of crashing.

### Creating an Error Boundary

Error boundaries must be **class components** (as of React 18 — a hook equivalent is not yet available natively):

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called when a child throws — update state to show fallback
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after an error is caught — good for logging
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Send to error monitoring service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Using the Error Boundary

```jsx
function App() {
  return (
    <ErrorBoundary fallback={<p>Failed to load dashboard.</p>}>
      <Dashboard />
    </ErrorBoundary>
  );
}

// Multiple boundaries for isolated sections
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<NavFallback />}>
        <Navigation />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Content failed to load.</p>}>
        <MainContent />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Recommendations unavailable.</p>}>
        <RecommendationEngine /> {/* This can crash without taking down the page */}
      </ErrorBoundary>
    </div>
  );
}
```

### Using react-error-boundary (Recommended Library)

The `react-error-boundary` package provides a production-ready, hook-friendly solution:

```bash
npm install react-error-boundary
```

```jsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

// Fallback component receives error and reset function
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Oops! Something went wrong</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

// Wrap any component tree
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => logToService(error, info)}
      onReset={() => {
        // Optional: reset app state before retry
      }}
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
}

// Trigger error boundary from inside a component (e.g., in async code)
function DataFetcher() {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    fetchData().catch(showBoundary); // Surfaces async errors to the boundary
  }, []);
}
```

### What Error Boundaries Do NOT Catch

| Scenario | Caught? | Alternative |
|---|---|---|
| Errors in render / lifecycle | ✅ Yes | Error Boundary |
| Errors in event handlers | ❌ No | `try/catch` in the handler |
| Async errors (setTimeout, fetch) | ❌ No | `useErrorBoundary()` hook |
| Errors in the boundary itself | ❌ No | Wrap in another boundary |
| Server-side rendering errors | ❌ No | Framework-level handling |

```jsx
// ❌ Event handler errors are NOT caught by boundaries
function Button() {
  const handleClick = () => {
    throw new Error('Event handler error'); // NOT caught!
  };
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Use try/catch in event handlers
function Button() {
  const handleClick = () => {
    try {
      riskyOperation();
    } catch (error) {
      setError(error.message);
    }
  };
  return <button onClick={handleClick}>Click</button>;
}
```

### Error Monitoring Integration

```jsx
import * as Sentry from '@sentry/react';

// Wrap your app with Sentry's error boundary
const App = Sentry.withErrorBoundary(RootApp, {
  fallback: <ErrorPage />,
  showDialog: true, // Let users report bugs
});

// Or use componentDidCatch to log
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, { extra: errorInfo });
}
```

---

## 5. Accessibility (a11y)

Accessibility ensures your app is usable by everyone — including people using screen readers, keyboard navigation, or other assistive technologies. It's also required by law in many countries (WCAG 2.1).

### Semantic HTML First

Use the right HTML element for the job. Semantic elements have built-in accessibility roles:

```jsx
// ❌ Non-semantic — screen readers can't interpret this
<div onClick={handleSubmit} className="button">Submit</div>

// ✅ Semantic — keyboard accessible, correct role, focusable
<button type="submit" onClick={handleSubmit}>Submit</button>

// ❌ Bad structure
<div className="nav">
  <div className="nav-item">Home</div>
</div>

// ✅ Semantic structure
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes add semantics when HTML alone isn't enough:

```jsx
// aria-label — provides accessible name when visible text isn't sufficient
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" /> {/* Hide decorative icon from screen readers */}
</button>

// aria-labelledby — points to an element that labels this one
<section aria-labelledby="section-title">
  <h2 id="section-title">Recent Orders</h2>
  {/* ... */}
</section>

// aria-describedby — points to supplemental description
<input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">Must be 8+ characters with a number</p>

// aria-live — announce dynamic updates to screen readers
<div aria-live="polite" aria-atomic="true">
  {statusMessage} {/* e.g., "3 items added to cart" */}
</div>

// aria-expanded — for collapsible regions
<button
  aria-expanded={isOpen}
  aria-controls="menu-content"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu
</button>
<div id="menu-content" hidden={!isOpen}>
  {/* menu items */}
</div>
```

### Accessible Forms

```jsx
function AccessibleForm() {
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        {/* Always associate label with input */}
        <label htmlFor="email">
          Email Address
          <span aria-hidden="true"> *</span> {/* Visual asterisk */}
        </label>

        <input
          id="email"
          type="email"
          name="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          autoComplete="email"
        />

        <p id="email-hint" className="hint">
          We'll never share your email.
        </p>

        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="error"
            aria-live="assertive"
          >
            {errors.email}
          </p>
        )}
      </div>

      <button type="submit">Subscribe</button>
    </form>
  );
}
```

### Keyboard Navigation

All interactive elements must be keyboard operable:

```jsx
// ✅ Keyboard-accessible custom dropdown
function Dropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        if (isOpen && focusedIndex >= 0) onSelect(options[focusedIndex]);
        setIsOpen(o => !o);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      onKeyDown={handleKeyDown}
    >
      <button
        aria-label="Select an option"
        onClick={() => setIsOpen(o => !o)}
      >
        Choose...
      </button>

      {isOpen && (
        <ul role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={focusedIndex === index}
              tabIndex={focusedIndex === index ? 0 : -1}
              onClick={() => onSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Focus Management

```jsx
import { useRef, useEffect } from 'react';

// Move focus to dialog when it opens
function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      dialogRef.current?.focus();
    } else {
      // Restore focus when dialog closes
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1} // Programmatically focusable
      className="modal"
    >
      <h2 id="modal-title">Dialog Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Color and Contrast

```jsx
// ✅ Never convey information with color alone
function StatusBadge({ status }) {
  return (
    <span
      className={`badge badge--${status}`}
      aria-label={`Status: ${status}`}
    >
      {/* Icon + text — not just a colored dot */}
      <StatusIcon status={status} aria-hidden="true" />
      {status}
    </span>
  );
}
```

### Skip Navigation Links

```jsx
// Allow keyboard users to skip repetitive navigation
function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
```

```css
/* Visually hidden but accessible to keyboard users */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
}

.skip-link:focus {
  top: 0; /* Visible when focused */
}
```

### Testing Accessibility

```bash
# Install eslint-plugin-jsx-a11y for linting
npm install --save-dev eslint-plugin-jsx-a11y

# Install axe-core for automated testing
npm install --save-dev @axe-core/react
```

```jsx
// Add axe in development
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  const React = require('react');
  const ReactDOM = require('react-dom');
  axe(React, ReactDOM, 1000);
}
```

**Manual testing checklist:**
- [ ] Tab through all interactive elements — logical order?
- [ ] Use with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% — does layout break?
- [ ] Check with high contrast mode enabled
- [ ] Verify all images have meaningful `alt` text

---

## 6. SEO Considerations

React apps are client-side rendered by default, which presents SEO challenges — search engines may not execute JavaScript or may delay indexing. Here's how to handle it.

### The Core SEO Challenge in React

```
Traditional Website:
Browser → HTML response (content is there) → Render

Default React SPA:
Browser → Empty HTML shell → Download JS → Execute JS → Render content
              ↑
   Search crawlers may stop here or get delayed indexing
```

### Solution 1: Server-Side Rendering (SSR) with Next.js

Next.js is the most popular React framework for SEO-critical apps:

```jsx
// pages/products/[id].jsx (Next.js Pages Router)
export async function getServerSideProps({ params }) {
  // Runs on the server for every request
  const product = await fetchProduct(params.id);

  if (!product) {
    return { notFound: true }; // → 404 page
  }

  return { props: { product } };
}

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} | My Store</title>
        <meta name="description" content={product.description.slice(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.imageUrl} />
        <link rel="canonical" href={`https://mystore.com/products/${product.slug}`} />
      </Head>

      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </>
  );
}
```

### Static Site Generation (SSG) — Best for Performance

Pre-render pages at build time for maximum performance:

```jsx
// Next.js App Router (recommended)
// app/blog/[slug]/page.jsx

// Generate all paths at build time
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <time dateTime={post.publishedAt}>
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Managing Document Head (React Helmet / Next.js Head)

For non-Next.js apps, use `react-helmet-async`:

```bash
npm install react-helmet-async
```

```jsx
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Wrap your app
function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

// Use in any component
function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} | My Store</title>
        <meta name="description" content={product.description} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://site.com/products/${product.slug}`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:image" content={product.image} />

        {/* Canonical URL — prevent duplicate content */}
        <link rel="canonical" href={`https://site.com/products/${product.slug}`} />
      </Helmet>

      <main>
        <h1>{product.name}</h1>
      </main>
    </>
  );
}
```

### Structured Data (JSON-LD)

Structured data helps search engines understand content and enables rich results:

```jsx
function ProductPage({ product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {/* page content */}
    </>
  );
}
```

### Sitemap and Robots.txt

```jsx
// Next.js App Router: app/sitemap.js
export default async function sitemap() {
  const posts = await fetchAllPosts();

  return [
    {
      url: 'https://mysite.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `https://mysite.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ];
}

// Next.js App Router: app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://mysite.com/sitemap.xml',
  };
}
```

### Performance = SEO: Core Web Vitals

Google ranks pages partially on Core Web Vitals. Optimize React for these metrics:

```jsx
// 1. LCP (Largest Contentful Paint) — prioritize above-fold images
<img
  src="/hero.jpg"
  alt="Hero image"
  fetchPriority="high" // Hint browser to load this first
  loading="eager"      // Don't lazy-load above-fold images
  width={1200}
  height={600}         // Prevent layout shift
/>

// 2. CLS (Cumulative Layout Shift) — always reserve space for dynamic content
function ImageWithPlaceholder({ src, alt, width, height }) {
  return (
    // Reserve exact space before image loads
    <div style={{ aspectRatio: `${width}/${height}`, width: '100%' }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// 3. FID/INP — defer non-critical work
import { startTransition } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Urgent — update input immediately

    startTransition(() => {
      setResults(searchData(value)); // Non-urgent — can be deferred
    });
  };

  return <input value={query} onChange={handleChange} />;
}
```

### Code Splitting and Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Split large components — load only when needed
const HeavyChart = lazy(() => import('./components/HeavyChart'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### SEO Checklist for React Apps

| Item | Notes |
|---|---|
| Unique `<title>` per page | 50–60 characters |
| Unique meta description | 150–160 characters |
| Canonical URLs | Prevent duplicate content |
| Structured data (JSON-LD) | For rich results |
| Open Graph tags | For social sharing |
| Semantic HTML headings | One `<h1>` per page |
| Image `alt` attributes | Descriptive, not stuffed |
| SSR or SSG for content pages | Or use prerendering |
| Sitemap.xml | Submit to Google Search Console |
| Robots.txt | Control crawl access |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 |
| Mobile responsive | Google mobile-first indexing |

---

## Summary

| Topic | Key Takeaway |
|---|---|
| **Component Composition** | Build small, focused pieces. Use children, slots, compound components, and custom hooks. Memoize judiciously. |
| **Prop Drilling** | Use Context for global UI state, composition to restructure, and state libs for complex state. |
| **Key Props** | Use stable, unique data IDs. Never use index for dynamic lists. Use key changes to force resets. |
| **Error Boundaries** | Wrap page sections independently. Log to a monitoring service. Handle async errors with `useErrorBoundary`. |
| **Accessibility** | Start with semantic HTML. Add ARIA where needed. Test with keyboard and screen reader. |
| **SEO** | Use SSR/SSG for content pages. Manage `<head>` per route. Add structured data. Optimize Core Web Vitals. |

---

*React Phase 9 — Performance & Optimization Best Practices*  
*Next: Phase 10 — Testing (Unit, Integration, E2E)*
