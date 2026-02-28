# Vitest Complete Tutorial for React

A comprehensive guide to testing React applications with Vitest — from setup to advanced coverage and snapshot testing.

---

## Table of Contents

1. [Setup with Vite](#1-setup-with-vite)
2. [Writing Test Cases](#2-writing-test-cases)
3. [Coverage Reports](#3-coverage-reports)
4. [Snapshot Testing](#4-snapshot-testing)

---

## 1. Setup with Vite

### Prerequisites

- Node.js 18+
- A Vite-powered React project

### Create a New Vite + React Project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### Install Vitest and Testing Dependencies

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

| Package | Purpose |
|---|---|
| `vitest` | The test runner |
| `@vitest/ui` | Web-based test UI dashboard |
| `jsdom` | DOM environment for browser simulation |
| `@testing-library/react` | React component rendering utilities |
| `@testing-library/jest-dom` | Custom DOM matchers (`.toBeInTheDocument()`, etc.) |
| `@testing-library/user-event` | Simulate real user interactions |

### Configure Vite

Update `vite.config.js` to add Vitest configuration:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Use global APIs (describe, it, expect) without imports
    environment: 'jsdom',    // Simulate browser environment
    setupFiles: './src/test/setup.js', // Run before each test file
    css: true,               // Process CSS imports in tests
  },
})
```

### Create the Setup File

```js
// src/test/setup.js
import '@testing-library/jest-dom'
```

This imports the custom matchers so you can use `.toBeInTheDocument()`, `.toHaveValue()`, etc. in all your tests.

### Add Scripts to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage"
  }
}
```

- `npm test` — runs tests in watch mode
- `npm run test:ui` — opens the interactive browser UI
- `npm run test:run` — runs once and exits (useful for CI)

### Verify Setup

Create a quick sanity-check test:

```js
// src/test/sanity.test.js
import { expect, test } from 'vitest'

test('math works', () => {
  expect(1 + 1).toBe(2)
})
```

Run `npm test` — you should see a passing test.

---

## 2. Writing Test Cases

### File Naming Conventions

Vitest picks up files matching these patterns by default:

```
src/
  components/
    Button.jsx
    Button.test.jsx     ✅ co-located test
  __tests__/
    Button.test.js      ✅ test directory
    Button.spec.js      ✅ spec suffix also works
```

### Your First Component

```jsx
// src/components/Button.jsx
export function Button({ label, onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  )
}
```

### Basic Rendering Tests

```jsx
// src/components/Button.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('is enabled by default', () => {
    render(<Button label="Go" />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('can be disabled', () => {
    render(<Button label="Go" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Testing User Interactions

```jsx
// src/components/Counter.jsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  )
}
```

```jsx
// src/components/Counter.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Counter } from './Counter'

describe('Counter', () => {
  it('starts at zero', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments on click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByText('Increment'))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrements on click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByText('Decrement'))
    expect(screen.getByText('Count: -1')).toBeInTheDocument()
  })
})
```

> **Tip:** Always use `userEvent.setup()` (not the deprecated `userEvent.type()` directly) for accurate event simulation in v14+.

### Testing Forms

```jsx
// src/components/LoginForm.jsx
import { useState } from 'react'

export function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  )
}
```

```jsx
// src/components/LoginForm.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('calls onSubmit with email and password', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()

    render(<LoginForm onSubmit={mockSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(mockSubmit).toHaveBeenCalledOnce()
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
    })
  })
})
```

### Mocking Functions and Modules

```jsx
// Mock a function with vi.fn()
const mockFn = vi.fn().mockReturnValue(42)
expect(mockFn()).toBe(42)
expect(mockFn).toHaveBeenCalledTimes(1)

// Mock an entire module
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
}))
```

### Testing Async Components

```jsx
// src/components/UserCard.jsx
import { useEffect, useState } from 'react'

export function UserCard({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser)
  }, [userId])

  if (!user) return <p>Loading...</p>
  return <h2>{user.name}</h2>
}
```

```jsx
// src/components/UserCard.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: 1, name: 'Alice' }),
    })
  })

  it('shows loading state initially', () => {
    render(<UserCard userId={1} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows user name after loading', async () => {
    render(<UserCard userId={1} />)
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })
})
```

### Common Matchers Reference

```js
// Existence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()

// State
expect(element).toBeDisabled()
expect(element).toBeChecked()
expect(element).toHaveValue('hello')
expect(element).toHaveFocus()

// Content
expect(element).toHaveTextContent('Hello World')
expect(element).toHaveAttribute('href', '/home')
expect(element).toHaveClass('btn-primary')

// Mock assertions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith({ id: 1 })
expect(mockFn).toHaveBeenLastCalledWith('arg1')
```

---

## 3. Coverage Reports

Coverage tells you what percentage of your code is exercised by tests.

### Install the Coverage Provider

```bash
npm install -D @vitest/coverage-v8
```

> Vitest supports two providers: `v8` (built-in, fast) and `istanbul` (more detailed). `v8` is recommended for most projects.

### Configure Coverage in vite.config.js

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/main.jsx',
        'src/**/*.test.{js,jsx}',
        'src/test/**',
        'src/**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
```

### Run Coverage

```bash
npm run coverage
```

### Understanding the Output

```
 % Coverage report from v8
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   87.5  |   83.33  |   90.0  |   87.5  |
 components/Button.jsx   |   100   |   100    |   100   |   100   |
 components/Counter.jsx  |   100   |   100    |   100   |   100   |
 components/LoginForm.jsx|   75.0  |   66.67  |   80.0  |   75.0  |
-------------------------|---------|----------|---------|---------|
```

| Metric | What It Measures |
|---|---|
| **Statements** | Individual executable statements run |
| **Branches** | `if/else`, ternary, logical operators covered |
| **Functions** | Functions called at least once |
| **Lines** | Lines of code executed |

### HTML Coverage Report

After running `npm run coverage`, open the report in your browser:

```bash
open coverage/index.html
```

The HTML report shows a file-by-file breakdown with line-by-line highlighting — green for covered, red for uncovered.

### Enforcing Thresholds in CI

When thresholds are set in `vite.config.js`, Vitest will **fail the test run** if coverage drops below them. This prevents coverage regressions in pull requests.

```bash
# In your CI pipeline
npm run coverage
# Exits with code 1 if any threshold is breached
```

### Per-File Coverage with `--coverage.all`

By default, only tested files appear in coverage. To include untested files:

```js
// vite.config.js
coverage: {
  all: true, // Include files with 0% coverage too
  include: ['src/**/*.{js,jsx}'],
}
```

---

## 4. Snapshot Testing

Snapshot testing captures a "photo" of your component's rendered output and flags any future unintentional changes.

### How Snapshots Work

1. First run: Vitest creates a `.snap` file with the rendered output
2. Subsequent runs: Vitest compares the output to the stored snapshot
3. If they differ: the test fails — you decide whether to accept or reject the change

### Basic Snapshot Test

```jsx
// src/components/Badge.jsx
export function Badge({ type, children }) {
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  }
  return (
    <span style={{ backgroundColor: colors[type], color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
      {children}
    </span>
  )
}
```

```jsx
// src/components/Badge.test.jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('matches snapshot for success type', () => {
    const { container } = render(<Badge type="success">Active</Badge>)
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot for error type', () => {
    const { container } = render(<Badge type="error">Failed</Badge>)
    expect(container).toMatchSnapshot()
  })
})
```

### The Generated Snapshot File

After the first run, Vitest creates:

```
src/components/__snapshots__/Badge.test.jsx.snap
```

```
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`Badge > matches snapshot for success type 1`] = `
<div>
  <span
    style="background-color: rgb(34, 197, 94); color: white; padding: 4px 8px; border-radius: 4px;"
  >
    Active
  </span>
</div>
`;
```

### Inline Snapshots

For smaller components, keep snapshots in the test file itself:

```jsx
it('renders a badge inline', () => {
  const { container } = render(<Badge type="warning">Pending</Badge>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        style="background-color: rgb(245, 158, 11); color: white; padding: 4px 8px; border-radius: 4px;"
      >
        Pending
      </span>
    </div>
  `)
})
```

> Vitest will auto-write the inline snapshot on first run.

### Updating Snapshots

When you intentionally change a component's output, update the snapshots:

```bash
# Update all snapshots
npm test -- --update-snapshots

# Or shorthand
npm test -- -u
```

Always review the diff before updating to confirm the changes are intentional.

### Component Snapshot Best Practices

**Do use snapshots for:**
- UI components with stable, predictable markup
- Design system components (buttons, badges, cards)
- Components that should not change unexpectedly

**Avoid snapshots for:**
- Components with dynamic data (timestamps, random IDs)
- Highly complex components — the snapshot becomes unreadable
- Business logic — use unit tests instead

### Snapshot Testing with Props Variations

```jsx
// src/components/Alert.test.jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Alert } from './Alert'

describe('Alert snapshots', () => {
  const variants = ['info', 'success', 'warning', 'error']

  variants.forEach(variant => {
    it(`renders ${variant} variant`, () => {
      const { container } = render(
        <Alert variant={variant}>This is a {variant} alert</Alert>
      )
      expect(container).toMatchSnapshot()
    })
  })
})
```

### Excluding Dynamic Values from Snapshots

Use `expect.any()` or `toMatchSnapshot` with property matchers:

```jsx
it('renders user card with dynamic timestamp', () => {
  const user = { id: 1, name: 'Alice', createdAt: new Date().toISOString() }
  const { container } = render(<UserCard user={user} />)

  // Use a serializer or replace dynamic values before snapshotting
  expect({
    name: user.name,
    // Exclude dynamic timestamp
  }).toMatchSnapshot()
})
```

---

## Project Structure Summary

A well-organized Vitest + React project looks like this:

```
my-app/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx          ← co-located unit tests
│   │   ├── Counter.jsx
│   │   └── Counter.test.jsx
│   ├── test/
│   │   └── setup.js                 ← global test setup
│   └── main.jsx
├── coverage/                        ← generated by `npm run coverage`
│   └── index.html
├── vite.config.js
└── package.json
```

---

## Quick Reference

| Command | Description |
|---|---|
| `npm test` | Watch mode |
| `npm run test:run` | Run once (CI) |
| `npm run test:ui` | Browser UI |
| `npm run coverage` | Coverage report |
| `npm test -- -u` | Update snapshots |
| `npm test -- Button` | Run matching files |

---

## Further Reading

- [Vitest Documentation](https://vitest.dev)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest Coverage Guide](https://vitest.dev/guide/coverage)
- [Vitest Snapshot Guide](https://vitest.dev/guide/snapshot)
