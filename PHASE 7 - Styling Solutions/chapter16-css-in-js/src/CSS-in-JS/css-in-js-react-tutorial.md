# CSS-in-JS for React: Complete Tutorial
### Phase 7 – Styling Solutions (Week 5, Days 32–35)

---

## Table of Contents

1. [Introduction to CSS-in-JS](#1-introduction-to-css-in-js)
2. [styled-components Basics](#2-styled-components-basics)
3. [Props-Based Styling](#3-props-based-styling)
4. [Theming](#4-theming)
5. [Global Styles](#5-global-styles)
6. [Advanced Patterns](#6-advanced-patterns)
7. [Best Practices & Common Pitfalls](#7-best-practices--common-pitfalls)
8. [Mini Project: Themed Dashboard Card](#8-mini-project-themed-dashboard-card)

---

## 1. Introduction to CSS-in-JS

### What is CSS-in-JS?

CSS-in-JS is a styling approach where you write CSS directly inside your JavaScript (or TypeScript) files. Instead of maintaining separate `.css` files, your component styles live alongside your component logic.

### Why Use CSS-in-JS?

| Feature | Traditional CSS | CSS-in-JS |
|---|---|---|
| Scoping | Global (can leak) | Automatically scoped |
| Dynamic styles | Hard (class toggling) | Easy (JS expressions) |
| Dead code elimination | Manual | Automatic |
| Theming | CSS variables / preprocessors | Native JS objects |
| Colocation | Separate files | Same file as component |

### Popular Libraries

- **styled-components** – The most popular. Tag template literal API.
- **Emotion** – Very similar to styled-components, slightly faster.
- **vanilla-extract** – Zero-runtime, TypeScript-first.
- **Linaria** – Zero-runtime alternative.

> This tutorial focuses on **styled-components**, the industry standard for learning CSS-in-JS concepts.

---

## 2. styled-components Basics

### Installation

```bash
npm install styled-components
# or
yarn add styled-components

# TypeScript types
npm install -D @types/styled-components
```

### Your First Styled Component

```jsx
import styled from 'styled-components';

// Create a styled <button> element
const Button = styled.button`
  background-color: #6200ea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3700b3;
  }
`;

// Use it exactly like a regular React component
function App() {
  return <Button>Click Me</Button>;
}
```

**What's happening here:**
- `styled.button` creates a new React component that renders a `<button>` element.
- The template literal contains plain CSS.
- styled-components automatically generates a unique class name and injects the CSS.
- `&` refers to the component itself (like Sass nesting).

---

### How It Works Under the Hood

```
styled.button`...CSS...`
       ↓
Generates unique class: sc-abc123
       ↓
Injects into <head>: .sc-abc123 { ... }
       ↓
Renders: <button class="sc-abc123">...</button>
```

---

### Styling Any HTML Element

styled-components works with any valid HTML element:

```jsx
const Title = styled.h1`font-size: 2rem; color: #333;`;
const Container = styled.div`max-width: 1200px; margin: 0 auto;`;
const Input = styled.input`border: 2px solid #ccc; padding: 8px; border-radius: 4px;`;
const Link = styled.a`color: #6200ea; text-decoration: none;`;
const Image = styled.img`width: 100%; border-radius: 8px;`;
```

---

### Extending Styles

Inherit and override styles from an existing styled component using `styled(Component)`:

```jsx
const BaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
`;

// Extend BaseButton — inherits all styles above
const PrimaryButton = styled(BaseButton)`
  background-color: #6200ea;
  color: white;
`;

const DangerButton = styled(BaseButton)`
  background-color: #b00020;
  color: white;
`;

const OutlineButton = styled(BaseButton)`
  background-color: transparent;
  border: 2px solid #6200ea;
  color: #6200ea;
`;
```

---

### The `as` Prop – Polymorphic Components

Render a styled component as a different HTML element without losing its styles:

```jsx
const Button = styled.button`
  background: #6200ea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
`;

// Renders as <a> but keeps Button styles
<Button as="a" href="/about">Go to About</Button>

// Renders as a React Router <Link>
import { Link } from 'react-router-dom';
<Button as={Link} to="/dashboard">Dashboard</Button>
```

---

### Pseudo-Classes, Pseudo-Elements & Media Queries

```jsx
const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;

  /* Pseudo-class */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  /* Pseudo-element */
  &::before {
    content: '';
    display: block;
    height: 4px;
    background: #6200ea;
    border-radius: 4px 4px 0 0;
    margin: -20px -20px 20px;
  }

  /* Media query */
  @media (max-width: 768px) {
    padding: 12px;
  }
`;
```

---

### Nesting & Child Selectors

```jsx
const Nav = styled.nav`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #1a1a2e;

  /* Style child <a> elements */
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: #bb86fc;
    }

    &.active {
      color: #6200ea;
      border-bottom: 2px solid #6200ea;
    }
  }
`;
```

---

## 3. Props-Based Styling

This is where CSS-in-JS truly shines. You can use JavaScript expressions — including component props — inside your styles.

### Basic Props Interpolation

```jsx
// TypeScript: define your props interface
interface ButtonProps {
  primary?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 10px 20px;
  border-radius: 6px;
  border: 2px solid #6200ea;
  cursor: pointer;
  font-size: 16px;

  /* Dynamically switch styles based on props */
  background-color: ${(props) => props.primary ? '#6200ea' : 'transparent'};
  color: ${(props) => props.primary ? 'white' : '#6200ea'};
`;

// Usage
<Button>Secondary</Button>
<Button primary>Primary</Button>
```

---

### Multiple Variants with css Helper

For complex conditional styling, use the `css` helper to keep things clean:

```jsx
import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantStyles = {
  primary: css`
    background: #6200ea;
    color: white;
    border: none;
    &:hover { background: #3700b3; }
  `,
  secondary: css`
    background: transparent;
    color: #6200ea;
    border: 2px solid #6200ea;
    &:hover { background: #ede7f6; }
  `,
  danger: css`
    background: #b00020;
    color: white;
    border: none;
    &:hover { background: #7f0016; }
  `,
  ghost: css`
    background: transparent;
    color: #333;
    border: 1px solid #ccc;
    &:hover { background: #f5f5f5; }
  `,
};

const sizeStyles = {
  sm: css`padding: 6px 12px; font-size: 13px;`,
  md: css`padding: 10px 20px; font-size: 15px;`,
  lg: css`padding: 14px 28px; font-size: 18px;`,
};

const Button = styled.button<ButtonProps>`
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  /* Apply variant styles */
  ${({ variant = 'primary' }) => variantStyles[variant]}

  /* Apply size styles */
  ${({ size = 'md' }) => sizeStyles[size]}

  /* Full width modifier */
  ${({ fullWidth }) => fullWidth && css`width: 100%; display: block;`}

  /* Disabled state */
  ${({ disabled }) => disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

// Usage
<Button>Default Primary Medium</Button>
<Button variant="danger" size="lg">Delete Account</Button>
<Button variant="secondary" size="sm" fullWidth>Subscribe</Button>
```

---

### Dynamic Values from Props

```jsx
interface ProgressBarProps {
  value: number;       // 0 – 100
  color?: string;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ value }) => `${value}%`};
    background: ${({ color }) => color ?? '#6200ea'};
    border-radius: 6px;
    transition: width 0.4s ease;
  }
`;

// Usage
<ProgressBar value={72} />
<ProgressBar value={45} color="#00c853" />
```

---

### Attrs – Default HTML Attributes

Use `.attrs()` to set default attributes on the underlying element:

```jsx
// Input with default type and placeholder
const EmailInput = styled.input.attrs({
  type: 'email',
  placeholder: 'Enter your email...',
  autoComplete: 'email',
})`
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 15px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #6200ea;
    box-shadow: 0 0 0 3px rgba(98, 0, 234, 0.2);
  }
`;

// Dynamic attrs based on props
interface InputProps {
  hasError?: boolean;
}

const FormInput = styled.input.attrs<InputProps>((props) => ({
  'aria-invalid': props.hasError ? 'true' : undefined,
}))<InputProps>`
  border: 2px solid ${({ hasError }) => hasError ? '#b00020' : '#ccc'};
  padding: 10px;
  border-radius: 6px;
  width: 100%;
`;
```

---

## 4. Theming

Theming lets you define a design system (colors, fonts, spacing) in one place and access it throughout your entire app.

### Step 1 – Define Your Theme

```typescript
// src/theme.ts

export const theme = {
  colors: {
    primary: '#6200ea',
    primaryDark: '#3700b3',
    secondary: '#03dac6',
    danger: '#b00020',
    success: '#00c853',
    warning: '#ffab00',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#757575',
    border: '#e0e0e0',
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Poppins', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '48px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 24px rgba(0,0,0,0.20)',
  },
};

// TypeScript: export the type for use in components
export type Theme = typeof theme;
```

---

### Step 2 – Wrap Your App with ThemeProvider

```jsx
// src/main.tsx (or index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

### Step 3 – Access the Theme in Components

```jsx
// Access via props.theme
const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
```

---

### TypeScript – Type Your Theme

Augment the styled-components DefaultTheme so you get autocomplete everywhere:

```typescript
// src/styled.d.ts
import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

After this, `theme.colors.primary` will have full IntelliSense inside every styled component.

---

### Dark Mode with Multiple Themes

```typescript
// src/theme.ts
export const lightTheme = {
  colors: {
    primary: '#6200ea',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    border: '#e0e0e0',
  },
};

export const darkTheme = {
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#e1e1e1',
    border: '#333',
  },
};
```

```jsx
// App.tsx – Toggle between themes
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
      {/* rest of app */}
    </ThemeProvider>
  );
}
```

---

### useTheme Hook

Access the theme directly inside regular (non-styled) React components:

```jsx
import { useTheme } from 'styled-components';

function MyComponent() {
  const theme = useTheme();

  return (
    <canvas
      style={{ background: theme.colors.background }}
      width={400}
      height={300}
    />
  );
}
```

---

## 5. Global Styles

### createGlobalStyle

Use `createGlobalStyle` to apply CSS that targets the document root — resets, fonts, base typography:

```jsx
// src/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Root variables (optional alongside theme) */
  :root {
    font-size: 16px;
  }

  /* Base body styles — uses theme */
  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    background: rgba(0, 0, 0, 0.07);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus visible for accessibility */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
```

```jsx
// src/main.tsx — Add GlobalStyles inside ThemeProvider
<ThemeProvider theme={theme}>
  <GlobalStyles />
  <App />
</ThemeProvider>
```

> **Important:** `GlobalStyles` must be inside `ThemeProvider` to access the theme.

---

## 6. Advanced Patterns

### 6.1 Component Selectors (Targeting Other Styled Components)

```jsx
const Icon = styled.span`
  transition: transform 0.2s;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  /* Target the Icon when Button is hovered */
  &:hover ${Icon} {
    transform: translateX(4px);
  }
`;

// Usage
<Button>
  <Icon>→</Icon>
  Next Step
</Button>
```

---

### 6.2 Keyframe Animations

```jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.95); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #6200ea;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Skeleton = styled.div`
  background: #e0e0e0;
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const AnimatedCard = styled.div`
  animation: ${fadeInUp} 0.4s ease both;
`;
```

---

### 6.3 shouldForwardProp – Keeping DOM Clean

By default, styled-components forwards all props to the DOM, which can cause React warnings for non-standard HTML attributes. Use `shouldForwardProp` to filter them out:

```jsx
import styled from 'styled-components';

interface BoxProps {
  $flex?: boolean;
  $gap?: string;
  $color?: string;
}

// Props prefixed with $ are a convention — but still need filtering
const Box = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['$flex', '$gap', '$color'].includes(prop),
})<BoxProps>`
  display: ${({ $flex }) => $flex ? 'flex' : 'block'};
  gap: ${({ $gap }) => $gap ?? '0'};
  color: ${({ $color }) => $color ?? 'inherit'};
`;

// ✅ $flex, $gap, $color are NOT forwarded to the DOM
<Box $flex $gap="16px">...</Box>
```

> **Convention:** Prefix custom props with `$` (called "transient props") to signal they are styling-only.

---

### 6.4 Mixin Helpers

Extract reusable CSS snippets with the `css` helper:

```jsx
import { css } from 'styled-components';

// Reusable mixins
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const truncate = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const cardBase = css`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
`;

// Use inside styled components
const CenteredBox = styled.div`
  ${flexCenter}
  height: 200px;
`;

const TitleText = styled.h2`
  ${truncate}
  max-width: 300px;
`;

const FeatureCard = styled.div`
  ${cardBase}
  border-top: 4px solid #6200ea;
`;
```

---

## 7. Best Practices & Common Pitfalls

### ✅ Do

- **Define styled components outside of render functions.** Defining them inside causes re-creation on every render and breaks CSS injection.
- **Use the `$` prefix for transient (styling-only) props** to avoid DOM attribute warnings.
- **Keep components small and composable** — one styled component per UI element.
- **Co-locate styles with the component file** for better maintainability.
- **Use `shouldForwardProp`** when building reusable design system components.
- **Leverage the theme** rather than hardcoding color values.

---

### ❌ Don't

```jsx
// ❌ DON'T define inside render — causes performance issues
function BadComponent() {
  const StyledDiv = styled.div`color: red;`; // Re-created every render!
  return <StyledDiv>Hello</StyledDiv>;
}

// ✅ DO define outside
const StyledDiv = styled.div`color: red;`;

function GoodComponent() {
  return <StyledDiv>Hello</StyledDiv>;
}
```

```jsx
// ❌ DON'T use inline styles to override styled-component styles
<Button style={{ background: 'red' }}>Click</Button>

// ✅ DO use props or extend the component
<Button danger>Click</Button>
// or
const RedButton = styled(Button)`background: red;`;
```

---

### Performance Tips

- Use the **babel-plugin-styled-components** for better class names in development and faster builds in production.
- For very large apps, consider **Emotion** (same API, often faster) or **vanilla-extract** (zero-runtime).
- Avoid interpolating functions that change reference on every render.

---

## 8. Mini Project: Themed Dashboard Card

Let's put it all together by building a complete, reusable `DashboardCard` component with props-based styling and full theme support.

```jsx
// src/components/DashboardCard.tsx
import styled, { css, keyframes } from 'styled-components';

// ── Types ──────────────────────────────────────────────────────────────────
type Status = 'success' | 'warning' | 'danger' | 'info';

interface DashboardCardProps {
  $status?: Status;
  $loading?: boolean;
}

// ── Animations ─────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Status color map ────────────────────────────────────────────────────────
const statusColors = {
  success: css`border-top: 4px solid ${({ theme }) => theme.colors.success};`,
  warning: css`border-top: 4px solid ${({ theme }) => theme.colors.warning};`,
  danger:  css`border-top: 4px solid ${({ theme }) => theme.colors.danger};`,
  info:    css`border-top: 4px solid ${({ theme }) => theme.colors.primary};`,
};

// ── Styled Components ───────────────────────────────────────────────────────
const CardWrapper = styled.div<DashboardCardProps>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${fadeIn} 0.35s ease both;
  transition: box-shadow 0.2s, transform 0.2s;

  ${({ $status }) => $status && statusColors[$status]}

  ${({ $loading }) => $loading && css`
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% auto;
    animation: ${shimmer} 1.5s linear infinite;
    pointer-events: none;
  `}

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CardMetric = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const CardSubtext = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Badge = styled.span<{ $status: Status }>`
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  background: ${({ $status, theme }) => ({
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger:  theme.colors.danger,
    info:    theme.colors.primary,
  }[$status])};

  color: white;
`;

// ── Component ───────────────────────────────────────────────────────────────
interface Props {
  title: string;
  metric: string;
  subtext?: string;
  status?: Status;
  loading?: boolean;
}

export function DashboardCard({ title, metric, subtext, status = 'info', loading }: Props) {
  return (
    <CardWrapper $status={status} $loading={loading}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Badge $status={status}>{status}</Badge>
      </CardHeader>
      <CardMetric>{metric}</CardMetric>
      {subtext && <CardSubtext>{subtext}</CardSubtext>}
    </CardWrapper>
  );
}
```

```jsx
// Usage in App.tsx
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { DashboardCard } from './components/DashboardCard';

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '24px',
  padding: '32px',
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div style={grid}>
        <DashboardCard
          title="Total Revenue"
          metric="$142,800"
          subtext="↑ 12% from last month"
          status="success"
        />
        <DashboardCard
          title="Churn Rate"
          metric="3.4%"
          subtext="↑ 0.8% — needs attention"
          status="warning"
        />
        <DashboardCard
          title="Server Errors"
          metric="58"
          subtext="↑ 220% spike detected"
          status="danger"
        />
        <DashboardCard
          title="Active Users"
          metric="9,204"
          subtext="Past 30 days"
          status="info"
          loading
        />
      </div>
    </ThemeProvider>
  );
}
```

---

## Summary

| Concept | What You Learned |
|---|---|
| **Basics** | `styled.element`, pseudo-classes, nesting, media queries |
| **Extending** | `styled(Component)`, `as` prop |
| **Props styling** | Interpolated functions, `css` helper, variants |
| **Theming** | `ThemeProvider`, `theme` prop, `useTheme`, dark mode |
| **Global styles** | `createGlobalStyle`, CSS resets, base typography |
| **Advanced** | Component selectors, `keyframes`, `shouldForwardProp`, mixins |

---

## Further Reading

- [styled-components official docs](https://styled-components.com/docs)
- [Emotion](https://emotion.sh/docs/introduction) – A fast styled-components alternative
- [vanilla-extract](https://vanilla-extract.style/) – Zero-runtime CSS-in-JS
- [Design Tokens with Style Dictionary](https://amzn.github.io/style-dictionary/)

---

*Phase 7 — Styling Solutions | CSS-in-JS Tutorial*
