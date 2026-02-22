# Phase 7: Styling Solutions — Utility-First CSS with Tailwind

## Table of Contents

1. [Introduction to Utility-First CSS](#1-introduction-to-utility-first-css)
2. [Setting Up Tailwind CSS with React](#2-setting-up-tailwind-css-with-react)
3. [Core Utility Classes](#3-core-utility-classes)
4. [Class Composition](#4-class-composition)
5. [Responsive Design](#5-responsive-design)
6. [Dark Mode](#6-dark-mode)
7. [Custom Configurations](#7-custom-configurations)
8. [Real-World Project: Building a Dashboard Card](#8-real-world-project-building-a-dashboard-card)
9. [Best Practices & Common Pitfalls](#9-best-practices--common-pitfalls)
10. [Summary & Next Steps](#10-summary--next-steps)

---

## 1. Introduction to Utility-First CSS

Traditional CSS approaches like BEM, CSS Modules, or Styled Components ask you to *name things* — you write a class, give it a name, and then style it. Utility-first CSS flips this model: **you style directly in your markup using small, single-purpose classes.**

### Traditional Approach vs. Utility-First

**Traditional CSS:**
```css
/* styles.css */
.card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```
```jsx
// Component
<div className="card">Hello</div>
```

**Utility-First (Tailwind):**
```jsx
<div className="bg-white rounded-lg p-4 shadow-md">Hello</div>
```

### Why Utility-First?

- **No naming fatigue** — stop inventing class names like `.card-container-wrapper`
- **No dead CSS** — unused classes are purged at build time
- **Instant discoverability** — styles live right where you read the component
- **Consistent design tokens** — spacing, colors, and sizing come from a shared scale
- **Smaller bundle** — Tailwind's final CSS is typically 5–20 KB after purging

### When Traditional CSS Still Wins

Tailwind isn't magic for everything. Reach for plain CSS or CSS Modules when you have complex animations, highly dynamic styles driven by runtime JavaScript values, or when your team has strong CSS expertise and the overhead of learning Tailwind outweighs benefits.

---

## 2. Setting Up Tailwind CSS with React

### Prerequisites

- Node.js 16+
- A React project (Vite or Create React App)

### Option A: Vite + React (Recommended)

```bash
# 1. Create a new Vite project
npm create vite@latest my-app -- --template react
cd my-app

# 2. Install Tailwind and its peer dependencies
npm install -D tailwindcss postcss autoprefixer

# 3. Generate config files
npx tailwindcss init -p
```

This creates two files:
- `tailwind.config.js` — your customization hub
- `postcss.config.js` — connects Tailwind to PostCSS

### Option B: Create React App

```bash
npx create-react-app my-app
cd my-app
npm install -D tailwindcss
npx tailwindcss init
```

### Configure Content Paths

Open `tailwind.config.js` and tell Tailwind which files to scan for class names:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

> **Why does this matter?** Tailwind scans these files to build a list of used classes. Anything NOT found here gets removed from the final CSS bundle.

### Add Tailwind Directives

Replace your main CSS file (`src/index.css`) content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

These three directives inject:
- **base** — Tailwind's CSS reset (Preflight)
- **components** — any component-layer styles
- **utilities** — all the utility classes

### Import in Your Entry Point

Make sure `src/main.jsx` (or `src/index.js`) imports the CSS:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'   // ← must come before App
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Verify Installation

Replace `src/App.jsx` with this and run `npm run dev`:

```jsx
export default function App() {
  return (
    <h1 className="text-3xl font-bold text-blue-600 p-8">
      Tailwind is working! 🎉
    </h1>
  )
}
```

If you see a large blue heading, you're set.

---

## 3. Core Utility Classes

Tailwind organizes utilities into logical categories. Here's a quick reference for the ones you'll use every day.

### Spacing

Tailwind uses a numeric scale where `1 = 4px`. So `p-4` = `padding: 16px`.

```jsx
// Padding
<div className="p-4">   // padding: 16px (all sides)
<div className="px-6">  // padding-left + padding-right: 24px
<div className="py-2">  // padding-top + padding-bottom: 8px
<div className="pt-8">  // padding-top: 32px

// Margin
<div className="m-4">   // margin: 16px
<div className="mx-auto"> // center horizontally
<div className="mt-4 mb-2"> // top and bottom

// Space between children
<div className="space-y-4"> // adds margin-top to all children except first
<div className="space-x-2">
```

### Typography

```jsx
// Size
<p className="text-sm">   // 14px
<p className="text-base"> // 16px (default)
<p className="text-lg">   // 18px
<p className="text-xl">   // 20px
<p className="text-2xl">  // 24px
<p className="text-4xl">  // 36px

// Weight
<p className="font-light">    // 300
<p className="font-normal">   // 400
<p className="font-medium">   // 500
<p className="font-semibold"> // 600
<p className="font-bold">     // 700

// Color
<p className="text-gray-600">
<p className="text-blue-500">
<p className="text-red-700">

// Alignment & decoration
<p className="text-center">
<p className="underline">
<p className="line-through">
<p className="uppercase tracking-widest">
```

### Colors

Tailwind ships with a curated palette. Colors follow the pattern `{property}-{color}-{shade}`:

```jsx
// Background
<div className="bg-white">
<div className="bg-gray-100">
<div className="bg-blue-500">
<div className="bg-indigo-700">

// Border
<div className="border border-gray-300">
<div className="border-2 border-blue-500">

// Text
<p className="text-slate-800">
<p className="text-emerald-600">
```

Shades run from `50` (lightest) to `950` (darkest): `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

### Layout & Flexbox

```jsx
// Display
<div className="flex">
<div className="grid">
<div className="hidden">  // display: none
<div className="block">

// Flexbox
<div className="flex items-center justify-between">
<div className="flex flex-col gap-4">
<div className="flex-1">  // flex: 1 1 0%
<div className="flex-shrink-0">

// Grid
<div className="grid grid-cols-3 gap-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
<div className="col-span-2">
```

### Sizing

```jsx
// Width
<div className="w-full">    // 100%
<div className="w-1/2">     // 50%
<div className="w-64">      // 256px
<div className="w-screen">  // 100vw
<div className="max-w-md">  // max-width: 28rem
<div className="min-w-0">   // min-width: 0

// Height
<div className="h-full">
<div className="h-screen">
<div className="h-16">      // 64px
```

### Borders & Rounded Corners

```jsx
<div className="rounded">       // border-radius: 4px
<div className="rounded-md">    // 6px
<div className="rounded-lg">    // 8px
<div className="rounded-xl">    // 12px
<div className="rounded-2xl">   // 16px
<div className="rounded-full">  // 9999px (circle/pill)

<div className="border">
<div className="border-2">
<div className="border-t">      // top only
<div className="border-gray-200">
```

### Shadows & Opacity

```jsx
<div className="shadow-sm">
<div className="shadow">
<div className="shadow-md">
<div className="shadow-lg">
<div className="shadow-xl">

<div className="opacity-75">
<div className="opacity-50">
```

---

## 4. Class Composition

As your components grow, raw className strings can become unwieldy. Here are the patterns pros use.

### The Problem

```jsx
// Hard to read and maintain
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  Click Me
</button>
```

### Pattern 1: Variables and Template Literals

For simple conditional classes, a variable works fine:

```jsx
function Button({ variant = 'primary', disabled, children }) {
  const base = "px-4 py-2 font-semibold rounded-lg transition-colors duration-200"
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  }
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      className={`${base} ${variants[variant]} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### Pattern 2: clsx / classnames Library

`clsx` is the standard tool for conditional class composition:

```bash
npm install clsx
```

```jsx
import clsx from 'clsx'

function Button({ variant = 'primary', size = 'md', disabled, className, children }) {
  return (
    <button
      className={clsx(
        // Base styles always applied
        'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        // Size variants
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        // Color variants
        {
          'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400': variant === 'primary',
          'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400': variant === 'secondary',
          'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400': variant === 'danger',
        },
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        // Allow external class overrides
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Usage
<Button variant="primary" size="lg">Save Changes</Button>
<Button variant="danger" disabled>Delete Account</Button>
```

### Pattern 3: tailwind-merge (Handling Conflicts)

When you allow className overrides, you can end up with conflicting classes like `p-4 p-8`. `tailwind-merge` intelligently resolves these:

```bash
npm install tailwind-merge clsx
```

```jsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Create a utility function — conventionally called `cn`
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Now className overrides work correctly
function Card({ className, children }) {
  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-md', className)}>
      {children}
    </div>
  )
}

// p-10 properly overrides p-6 — no conflict
<Card className="p-10 shadow-xl">...</Card>
```

> **Pro tip:** Create `src/lib/utils.js` with this `cn` function and import it everywhere. This is the same pattern used by shadcn/ui and most modern React component libraries.

### Pattern 4: @apply in CSS (Component Layer)

For truly reusable styles that appear hundreds of times, you can extract them to CSS using `@apply`:

```css
/* src/index.css */
@tailwind base;
@tailwind components;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6;
  }

  .input-field {
    @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}

@tailwind utilities;
```

Use sparingly — `@apply` trades the visibility of styles for the succinctness of a single class name. Prefer composition over `@apply` for most cases.

---

## 5. Responsive Design

Tailwind uses a **mobile-first** approach. Unprefixed classes apply to all screen sizes; prefixed classes kick in at the specified breakpoint and above.

### Default Breakpoints

| Prefix | Min Width | Typical Target |
|--------|-----------|----------------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

### Mobile-First Thinking

Start with mobile styles, then add complexity for larger screens:

```jsx
// ❌ Desktop-first thinking (wrong with Tailwind)
<div className="grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">

// ✅ Mobile-first thinking (correct)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### Practical Examples

**Responsive text:**
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Hello World
</h1>
```

**Responsive layout — stack on mobile, side by side on desktop:**
```jsx
<div className="flex flex-col md:flex-row gap-6">
  <aside className="w-full md:w-64 shrink-0">Sidebar</aside>
  <main className="flex-1">Main content</main>
</div>
```

**Responsive grid:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <ProductCard key={item.id} {...item} />
  ))}
</div>
```

**Responsive padding and visibility:**
```jsx
// Hide on mobile, show on desktop
<nav className="hidden lg:flex items-center gap-6">
  ...
</nav>

// Mobile-only hamburger menu
<button className="lg:hidden">
  <MenuIcon />
</button>

// Adaptive padding
<section className="px-4 py-8 md:px-8 md:py-16 lg:px-16">
  ...
</section>
```

**Responsive typography and alignment:**
```jsx
<div className="text-center lg:text-left">
  <p className="text-base md:text-lg">
    Responsive paragraph text.
  </p>
</div>
```

### Responsive Component: Navigation Bar

```jsx
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <span className="text-xl font-bold text-blue-600">MyApp</span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Contact</a>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Home</a>
            <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">About</a>
            <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Contact</a>
          </div>
        )}
      </div>
    </nav>
  )
}
```

---

## 6. Dark Mode

Tailwind supports dark mode through the `dark:` variant. You control when dark mode activates via the `darkMode` config option.

### Configuration

```js
// tailwind.config.js
export default {
  darkMode: 'class', // 'media' | 'class' | 'selector'
  // ...
}
```

**`'media'`** — uses the OS-level `prefers-color-scheme` media query. Automatic, no JavaScript needed. The user can't toggle it within your app.

**`'class'`** — dark mode activates when a `.dark` class is present on a parent element (usually `<html>`). Gives you full control with a toggle button.

**`'selector'`** — like `'class'` but lets you specify a custom selector.

### Using dark: Variants

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
    Title
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    Subtitle text
  </p>
  <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white px-4 py-2 rounded-lg">
    Click Me
  </button>
</div>
```

### Building a Dark Mode Toggle

**Step 1: Create a hook**

```jsx
// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return [isDark, setIsDark]
}
```

**Step 2: Use in your app**

```jsx
// src/App.jsx
import { useDarkMode } from './hooks/useDarkMode'

function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={() => onToggle(prev => !prev)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default function App() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My App</h1>
        <DarkModeToggle isDark={isDark} onToggle={setIsDark} />
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <p className="text-gray-700 dark:text-gray-300">
          Toggle the button above to switch between light and dark mode.
        </p>
      </main>
    </div>
  )
}
```

### Dark Mode Color Strategy

A good dark mode isn't just "invert everything." Use a palette that feels intentional:

```jsx
// Page backgrounds — layered depth
<html className="bg-gray-950">            {/* darkest — page background */}
<div className="bg-gray-900">             {/* cards, panels */}
<div className="bg-gray-800">             {/* elevated elements */}

// Text hierarchy
<h1 className="text-white">              {/* primary */}
<h2 className="text-gray-200">           {/* secondary */}
<p className="text-gray-400">            {/* tertiary / muted */}
<span className="text-gray-500">         {/* disabled */}

// Borders
<div className="border-gray-700">        {/* subtle dividers */}
<div className="border-gray-600">        {/* more visible borders */}
```

---

## 7. Custom Configurations

The real power of Tailwind comes from extending it to match your design system.

### Extending the Theme

Always use `theme.extend` to add to Tailwind's defaults rather than replacing them:

```js
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom colors
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        accent: '#f59e0b',
      },

      // Custom font families
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
        '128': '32rem',    // 512px
      },

      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
      },

      // Custom box shadows
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0,0,0,0.1), 0 4px 16px -4px rgba(0,0,0,0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Custom screens
      screens: {
        'xs': '480px',
        '3xl': '1800px',
      },
    },
  },
  plugins: [],
}
```

Now you can use `bg-brand-500`, `font-display`, `shadow-glow`, `animate-fade-in`, etc.

### Overriding Defaults

To completely replace a default (instead of extending), put values directly in `theme` without `extend`:

```js
theme: {
  // This REPLACES all default colors with just these
  colors: {
    white: '#ffffff',
    black: '#000000',
    primary: '#3b82f6',
    danger: '#ef4444',
  },
  // extend adds TO defaults
  extend: {
    spacing: { '18': '4.5rem' }
  }
}
```

### Plugins

Tailwind's plugin API lets you add custom utilities programmatically:

```js
import plugin from 'tailwindcss/plugin'

export default {
  plugins: [
    // Built-in official plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),

    // Custom plugin
    plugin(function({ addUtilities, addComponents, theme }) {
      // Add custom utility classes
      addUtilities({
        '.text-balance': { 'text-wrap': 'balance' },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      })

      // Add custom component classes
      addComponents({
        '.prose-custom': {
          maxWidth: '65ch',
          lineHeight: theme('lineHeight.relaxed'),
          color: theme('colors.gray.700'),
        }
      })
    }),
  ],
}
```

### CSS Variables + Tailwind (Advanced)

For theming that can change at runtime (e.g., user-selectable brand colors), pair CSS variables with Tailwind:

```css
/* src/index.css */
:root {
  --color-primary: 59 130 246;  /* Stored as RGB channels */
  --color-accent:  245 158 11;
}

[data-theme='purple'] {
  --color-primary: 139 92 246;
}
```

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      accent:  'rgb(var(--color-accent) / <alpha-value>)',
    }
  }
}
```

```jsx
// Now bg-primary/50 gives you 50% opacity automatically
<div className="bg-primary text-white">
<div className="bg-primary/20 text-primary">
```

---

## 8. Real-World Project: Building a Dashboard Card

Let's combine everything — class composition, responsiveness, dark mode, and custom config — into a real component.

```jsx
// src/components/StatCard.jsx
import { cn } from '../lib/utils'

const trendColors = {
  up:   'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  flat: 'text-gray-500 dark:text-gray-400',
}

const trendIcons = {
  up:   '↑',
  down: '↓',
  flat: '→',
}

export function StatCard({ title, value, trend = 'flat', change, icon, className }) {
  return (
    <div className={cn(
      // Base layout
      'relative overflow-hidden',
      'rounded-2xl p-6',
      // Light mode
      'bg-white border border-gray-200 shadow-sm',
      // Dark mode
      'dark:bg-gray-800 dark:border-gray-700',
      // Hover effect
      'hover:shadow-md transition-shadow duration-200',
      // Custom override
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </p>
        {icon && (
          <span className="text-2xl p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>

      {/* Trend */}
      {change && (
        <div className={cn('flex items-center gap-1 text-sm font-medium', trendColors[trend])}>
          <span>{trendIcons[trend]}</span>
          <span>{change}</span>
          <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
            vs last month
          </span>
        </div>
      )}

      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-700/50" />
    </div>
  )
}
```

```jsx
// src/components/Dashboard.jsx
import { StatCard } from './StatCard'

const stats = [
  { title: 'Total Revenue',  value: '$48,295', trend: 'up',   change: '+12.5%', icon: '💰' },
  { title: 'Active Users',   value: '8,421',   trend: 'up',   change: '+3.2%',  icon: '👥' },
  { title: 'Bounce Rate',    value: '24.8%',   trend: 'down', change: '-1.8%',  icon: '📉' },
  { title: 'Avg. Session',   value: '3m 42s',  trend: 'flat', change: '+0.1%',  icon: '⏱️' },
]

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 transition-colors">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  )
}
```

---

## 9. Best Practices & Common Pitfalls

### ✅ Do This

**Keep related utilities together mentally.** Group by concern when writing class strings: layout → spacing → typography → colors → states.

```jsx
// Easier to scan
className="flex items-center gap-4   p-4   text-sm font-medium text-gray-700   bg-white border border-gray-200 rounded-lg   hover:bg-gray-50"
```

**Use the `cn` helper everywhere** you might need conditional classes or allow overrides.

**Commit your `tailwind.config.js`** to source control. It's a core part of your design system.

**Use Tailwind IntelliSense** — install the official VS Code extension for autocomplete, hover previews, and linting. It's indispensable.

**Don't hardcode arbitrary values without a reason.** Use the scale whenever possible. Reserve `w-[347px]` for truly one-off measurements.

### ❌ Avoid This

**Don't build classes dynamically with string concatenation:**

```jsx
// ❌ Tailwind can't detect this at build time — class gets purged
const color = 'blue'
<div className={`text-${color}-500`}>

// ✅ Use a lookup object instead
const colorMap = { blue: 'text-blue-500', red: 'text-red-500' }
<div className={colorMap[color]}>
```

**Don't over-abstract into components too early.** Tailwind's verbosity is a feature when you're still exploring your design. Extract to a component when you see a pattern repeated 3+ times.

**Don't fight Tailwind's spacing scale** with arbitrary values everywhere. If you find yourself using `w-[180px]` constantly, add `180px` to your custom config instead.

**Don't mix `@apply` and utility classes carelessly.** Choose one approach per component type and stick with it.

### Performance Notes

Tailwind's production build automatically purges all unused classes, resulting in tiny CSS files. For development, the CSS is large but served efficiently. Make sure your `content` config paths cover all files — missed paths mean classes get purged incorrectly in production.

---

## 10. Summary & Next Steps

### What You've Learned

In this module, you've built a solid foundation in utility-first CSS with Tailwind:

- **Utility-first philosophy** — why single-purpose classes beat semantic CSS in component-based React apps
- **Setup** — wiring Tailwind into Vite/React with proper content paths and directives
- **Core utilities** — spacing, typography, color, layout, sizing, and borders
- **Class composition** — `clsx`, `tailwind-merge`, and the `cn` utility pattern
- **Responsive design** — mobile-first breakpoints and adaptive layouts
- **Dark mode** — class-based dark mode with a reusable toggle hook
- **Custom configuration** — extending Tailwind's theme with your own design tokens, plugins, and CSS variable integration

### Key Mental Models

1. **Mobile-first**: Write for small screens first, add complexity with breakpoint prefixes
2. **Dark mode last**: Build light mode completely, then add `dark:` variants
3. **Extend, don't replace**: Use `theme.extend` to preserve Tailwind's defaults
4. **Compose, don't abstract**: Reach for `cn()` before `@apply` or new components

### Recommended Tools

- **Tailwind CSS IntelliSense** (VS Code) — autocomplete and preview
- **Tailwind Play** (play.tailwindcss.com) — browser sandbox for experiments
- **shadcn/ui** — a collection of components built on Tailwind + Radix UI
- **Headless UI** — unstyled accessible components you style with Tailwind

### What's Next

- **Phase 8: Animation & Interaction** — Framer Motion with Tailwind for polished UI transitions
- **Deeper Tailwind** — explore `@tailwindcss/typography` for rich text, and JIT mode's arbitrary value capabilities
- **Design System** — use your `tailwind.config.js` as the source of truth for a full design token system shared with your design team

---

*Phase 7 Complete — Utility-First CSS with Tailwind CSS ✓*
