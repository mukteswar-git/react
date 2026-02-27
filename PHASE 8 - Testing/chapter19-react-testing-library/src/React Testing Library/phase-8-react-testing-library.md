# Phase 8: React Testing Library

> **Goal**: Write tests that resemble how users interact with your app — not implementation details.

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [render and screen](#2-render-and-screen)
3. [Queries — getBy, findBy, queryBy](#3-queries--getby-findby-queryby)
4. [User Interactions with user-event](#4-user-interactions-with-user-event)
5. [Async Testing](#5-async-testing)
6. [Mocking API Calls](#6-mocking-api-calls)
7. [Testing Hooks](#7-testing-hooks)
8. [Testing Context](#8-testing-context)
9. [Testing Custom Hooks](#9-testing-custom-hooks)
10. [Quick Reference Cheatsheet](#10-quick-reference-cheatsheet)

---

## 1. Testing Philosophy

React Testing Library (RTL) is built on a single guiding principle:

> *"The more your tests resemble the way your software is used, the more confidence they can give you."*
> — Kent C. Dodds

### The Core Idea

Traditional testing approaches often test **implementation details** — internal state, method calls, component structure. RTL encourages testing **behavior** — what the user sees and does.

| ❌ Avoid (Implementation Detail) | ✅ Prefer (User Behavior) |
|---|---|
| Check `component.state.isOpen` | Check if a modal is visible in the DOM |
| Call `component.toggle()` directly | Click the button that triggers toggle |
| Assert on a class name | Assert on visible text or ARIA role |
| Inspect internal props | Check what the user ultimately sees |

### Why This Matters

- Tests don't break when you refactor internals
- Tests catch real bugs that affect users
- Tests serve as living documentation of behavior
- Tests are easier to understand by non-authors

### Setup

```bash
# Create React App includes RTL by default
npx create-react-app my-app

# For Vite or manual setup:
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# jest-dom extends Jest with custom matchers
# Add to your setup file (jest.setup.js):
import '@testing-library/jest-dom';
```

**`jest.config.js`**:
```js
module.exports = {
  setupFilesAfterFramework: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
};
```

---

## 2. render and screen

### `render`

`render` mounts your component into a virtual DOM (jsdom) and returns a set of query utilities.

```jsx
import { render } from '@testing-library/react';
import Greeting from './Greeting';

test('renders a greeting', () => {
  render(<Greeting name="Alice" />);
  // Component is now in the DOM
});
```

`render` also accepts an `options` object for wrapping providers, setting a container element, and more.

```jsx
render(<MyComponent />, {
  wrapper: MyProvider,        // Wrap with a context provider
  container: document.body,   // Mount into a specific element
  baseElement: document.body, // Element used as base for queries
});
```

### `screen`

`screen` is the recommended way to query the DOM. It's pre-bound to `document.body`, so you don't need to destructure from `render`.

```jsx
import { render, screen } from '@testing-library/react';

test('shows the username', () => {
  render(<UserCard username="alice123" />);

  // screen exposes all queries
  const heading = screen.getByRole('heading', { name: /alice123/i });
  expect(heading).toBeInTheDocument();
});
```

> **Why `screen` over destructuring from `render`?**  
> `screen` always queries the full document, it's easier to search in your editor, and it's the officially recommended modern approach.

### `screen.debug()`

Print the current DOM to the console — invaluable for debugging.

```jsx
test('debug example', () => {
  render(<MyComponent />);
  screen.debug();                       // Prints full DOM
  screen.debug(screen.getByRole('button')); // Prints specific element
});
```

### Cleanup

RTL automatically calls `cleanup()` after each test via `afterEach`, unmounting components and clearing the DOM. You don't need to do this manually.

---

## 3. Queries — getBy, findBy, queryBy

RTL provides three query families, each with a different behavior when no element is found.

### Query Families

| Family | No Match | Multiple Matches | Use Case |
|---|---|---|---|
| `getBy...` | Throws error | Throws error | Element **must** exist right now |
| `queryBy...` | Returns `null` | Throws error | Element **might not** exist |
| `findBy...` | Rejects (async) | Rejects (async) | Element appears **asynchronously** |
| `getAllBy...` | Throws error | Returns array | Multiple elements **must** exist |
| `queryAllBy...` | Returns `[]` | Returns array | Multiple optional elements |
| `findAllBy...` | Rejects (async) | Returns array | Multiple async elements |

### Query Types (Priority Order)

RTL recommends using queries in this order, from most to least accessible:

#### 1. `ByRole` — Most Preferred

Queries by ARIA role. This is the closest to how assistive technologies see your page.

```jsx
// <button>Submit</button>
screen.getByRole('button', { name: /submit/i });

// <input aria-label="Email" />
screen.getByRole('textbox', { name: /email/i });

// <h1>Dashboard</h1>
screen.getByRole('heading', { level: 1 });

// Common roles: button, link, textbox, checkbox, radio,
// heading, img, list, listitem, dialog, alert, navigation
```

#### 2. `ByLabelText`

For form elements associated with a label.

```jsx
// <label for="email">Email</label><input id="email" />
screen.getByLabelText(/email/i);

// Also works with aria-label and aria-labelledby
```

#### 3. `ByPlaceholderText`

For inputs identified by placeholder (use sparingly — prefer labels).

```jsx
// <input placeholder="Search..." />
screen.getByPlaceholderText(/search/i);
```

#### 4. `ByText`

Find by visible text content.

```jsx
// <p>Welcome back, Alice!</p>
screen.getByText(/welcome back/i);

// Exact match
screen.getByText('Exact Text');

// With element selector
screen.getByText(/submit/i, { selector: 'button' });
```

#### 5. `ByDisplayValue`

For the current value of form inputs.

```jsx
// <input value="Alice" />
screen.getByDisplayValue('Alice');
```

#### 6. `ByAltText`

For images.

```jsx
// <img alt="Profile photo" />
screen.getByAltText(/profile photo/i);
```

#### 7. `ByTitle`

For elements with a `title` attribute.

```jsx
// <span title="Delete item">🗑️</span>
screen.getByTitle(/delete item/i);
```

#### 8. `ByTestId` — Last Resort

Use `data-testid` only when no other query is appropriate.

```jsx
// <div data-testid="custom-chart">...</div>
screen.getByTestId('custom-chart');
```

### Practical Examples

```jsx
// GreetingForm.jsx
function GreetingForm({ onSubmit }) {
  const [name, setName] = useState('');
  return (
    <form onSubmit={() => onSubmit(name)}>
      <label htmlFor="name">Your Name</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Say Hello</button>
    </form>
  );
}

// GreetingForm.test.jsx
test('form elements are accessible', () => {
  render(<GreetingForm onSubmit={jest.fn()} />);

  // ✅ getBy — element must exist
  const input = screen.getByLabelText(/your name/i);
  const button = screen.getByRole('button', { name: /say hello/i });

  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});

test('error message does not appear initially', () => {
  render(<GreetingForm onSubmit={jest.fn()} />);

  // ✅ queryBy — element might not exist (returns null)
  const error = screen.queryByRole('alert');
  expect(error).not.toBeInTheDocument();
});
```

### Common `jest-dom` Matchers

```js
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveValue('Alice');
expect(element).toHaveTextContent(/hello/i);
expect(element).toHaveAttribute('type', 'submit');
expect(element).toHaveClass('active');
expect(element).toBeChecked();
expect(element).toHaveFocus();
```

---

## 4. User Interactions with user-event

`@testing-library/user-event` simulates real browser events — including all the intermediate events a real user would trigger (focus, keydown, keyup, input, change, etc.).

> **Always prefer `user-event` over `fireEvent`** for user interactions. `fireEvent` dispatches a single synthetic event; `user-event` dispatches the full event chain a real browser would.

### Setup (v14+)

```jsx
import userEvent from '@testing-library/user-event';

// v14 requires setup() for proper async handling
const user = userEvent.setup();
```

### Common Actions

#### Typing

```jsx
test('user can type in input', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  const emailInput = screen.getByLabelText(/email/i);

  await user.type(emailInput, 'alice@example.com');

  expect(emailInput).toHaveValue('alice@example.com');
});
```

#### Clicking

```jsx
test('user can click a button', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Click Me</button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Clearing and Re-typing

```jsx
await user.clear(input);
await user.type(input, 'new value');
```

#### Selecting from a Dropdown

```jsx
test('user selects an option', async () => {
  const user = userEvent.setup();
  render(
    <select aria-label="Country">
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>
  );

  await user.selectOptions(screen.getByRole('combobox'), 'uk');

  expect(screen.getByRole('combobox')).toHaveValue('uk');
});
```

#### Keyboard Events

```jsx
// Tab through fields
await user.tab();

// Press a specific key
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');
await user.keyboard('[ArrowDown]');
```

#### Checkbox and Radio

```jsx
test('user checks a checkbox', async () => {
  const user = userEvent.setup();
  render(<input type="checkbox" aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);

  expect(checkbox).toBeChecked();
});
```

#### Upload Files

```jsx
test('user uploads a file', async () => {
  const user = userEvent.setup();
  render(<input type="file" aria-label="Upload" />);

  const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
  await user.upload(screen.getByLabelText(/upload/i), file);

  expect(screen.getByLabelText(/upload/i).files[0]).toBe(file);
});
```

### Full Form Interaction Example

```jsx
// LoginForm.test.jsx
test('user can log in with valid credentials', async () => {
  const user = userEvent.setup();
  const mockLogin = jest.fn();

  render(<LoginForm onLogin={mockLogin} />);

  await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
  await user.type(screen.getByLabelText(/password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(mockLogin).toHaveBeenCalledWith({
    email: 'alice@example.com',
    password: 'secret123',
  });
});
```

---

## 5. Async Testing

React apps are full of async behavior — data fetching, timers, animations. RTL provides tools to handle all of it.

### `waitFor`

Retries an assertion until it passes or times out (default: 1000ms).

```jsx
import { render, screen, waitFor } from '@testing-library/react';

test('error message appears after failed submission', async () => {
  render(<SignupForm />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i);
  });
});
```

### `findBy` Queries (Async Built-in)

`findBy` queries are `getBy` + `waitFor` combined. Use them when an element appears after async work.

```jsx
test('user list loads after fetch', async () => {
  render(<UserList />);

  // Waits for the element to appear
  const alice = await screen.findByText('Alice');
  expect(alice).toBeInTheDocument();
});
```

### `waitForElementToBeRemoved`

Assert that an element disappears.

```jsx
test('loading spinner disappears after data loads', async () => {
  render(<DataTable />);

  // Loading state must exist first
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Then wait for it to go away
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  expect(screen.getByRole('table')).toBeInTheDocument();
});
```

### Fake Timers

For `setTimeout`, `setInterval`, or debounced functions.

```jsx
import { act } from '@testing-library/react';

jest.useFakeTimers();

test('toast disappears after 3 seconds', () => {
  render(<ToastNotification message="Saved!" />);
  expect(screen.getByText('Saved!')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
});

afterEach(() => jest.useRealTimers());
```

### `act`

RTL wraps most interactions in `act` automatically. You only need it manually when state updates happen outside RTL's control (timers, native events, etc.).

```jsx
import { act } from 'react-dom/test-utils';
// or
import { act } from '@testing-library/react';

act(() => {
  // trigger state update
});
```

---

## 6. Mocking API Calls

### Option 1: Mock with `jest.fn()` (Simple)

Mock imported modules directly with Jest.

```jsx
// api.js
export const fetchUser = async (id) => { /* real fetch */ };

// UserProfile.test.jsx
import * as api from './api';

test('displays user data', async () => {
  jest.spyOn(api, 'fetchUser').mockResolvedValue({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
  });

  render(<UserProfile userId={1} />);

  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('alice@example.com')).toBeInTheDocument();
});
```

### Option 2: Mock `fetch` Globally

```jsx
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ name: 'Alice' }),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('fetches and displays user', async () => {
  render(<UserCard userId={1} />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});
```

### Option 3: MSW — Mock Service Worker (Best Practice)

MSW intercepts actual network requests at the service worker level — no mocking of implementation details.

```bash
npm install --save-dev msw
```

**`src/mocks/handlers.js`**:
```js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Alice',
      email: 'alice@example.com',
    });
  }),

  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    if (body.password === 'wrong') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return HttpResponse.json({ token: 'abc123' });
  }),
];
```

**`src/mocks/server.js`**:
```js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**`jest.setup.js`**:
```js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // Reset overrides between tests
afterAll(() => server.close());
```

**Test with MSW**:
```jsx
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

test('shows user profile', async () => {
  render(<UserProfile userId="1" />);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

test('shows error on 404', async () => {
  // Override for this specific test
  server.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    })
  );

  render(<UserProfile userId="999" />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
});
```

---

## 7. Testing Hooks

For testing React component behavior driven by hooks, test the component itself. But sometimes you need to test the hook's logic in isolation.

### `renderHook`

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test('initializes with provided value', () => {
  const { result } = renderHook(() => useCounter(10));
  expect(result.current.count).toBe(10);
});
```

### Re-rendering with New Props

```jsx
test('updates when initialValue changes', () => {
  const { result, rerender } = renderHook(
    ({ initialValue }) => useCounter(initialValue),
    { initialProps: { initialValue: 0 } }
  );

  expect(result.current.count).toBe(0);

  rerender({ initialValue: 5 });

  // Note: re-render won't reset internal state unless the hook handles it
});
```

### Hooks with Async State

```jsx
test('fetches data asynchronously', async () => {
  const { result } = renderHook(() => useFetchUser(1));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data.name).toBe('Alice');
});
```

---

## 8. Testing Context

### Providing Context in Tests

If a component consumes context, wrap it in the provider when rendering.

```jsx
// ThemeContext.jsx
export const ThemeContext = createContext('light');

// ThemedButton.jsx
function ThemedButton({ children }) {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>{children}</button>;
}

// ThemedButton.test.jsx
test('applies dark theme class', () => {
  render(
    <ThemeContext.Provider value="dark">
      <ThemedButton>Click</ThemedButton>
    </ThemeContext.Provider>
  );

  expect(screen.getByRole('button')).toHaveClass('btn-dark');
});
```

### Reusable Wrapper Utility

Create a custom render function to avoid repeating provider boilerplate.

```jsx
// test-utils.jsx
import { render } from '@testing-library/react';
import { ThemeContext } from './ThemeContext';
import { AuthContext } from './AuthContext';

const AllProviders = ({ children }) => (
  <AuthContext.Provider value={{ user: { name: 'Alice' } }}>
    <ThemeContext.Provider value="light">
      {children}
    </ThemeContext.Provider>
  </AuthContext.Provider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

**Usage**:
```jsx
// Import from your custom utils instead of RTL directly
import { render, screen } from '../test-utils';

test('shows user name from auth context', () => {
  render(<UserGreeting />);
  expect(screen.getByText(/alice/i)).toBeInTheDocument();
});
```

### Testing Context Behavior

```jsx
// Test that context values change after user actions
test('toggles theme on button click', async () => {
  const user = userEvent.setup();
  render(<ThemeToggler />); // Component that manages theme state internally

  expect(screen.getByRole('main')).toHaveClass('light-theme');

  await user.click(screen.getByRole('button', { name: /toggle theme/i }));

  expect(screen.getByRole('main')).toHaveClass('dark-theme');
});
```

---

## 9. Testing Custom Hooks

Custom hooks often encapsulate complex logic. Test them with `renderHook`, covering initial state, state transitions, side effects, and edge cases.

### Example: `useLocalStorage`

```jsx
// useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
```

```jsx
// useLocalStorage.test.js
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

beforeEach(() => localStorage.clear());

test('returns initial value when storage is empty', () => {
  const { result } = renderHook(() => useLocalStorage('name', 'Alice'));
  expect(result.current[0]).toBe('Alice');
});

test('reads existing value from localStorage', () => {
  localStorage.setItem('name', JSON.stringify('Bob'));
  const { result } = renderHook(() => useLocalStorage('name', 'Alice'));
  expect(result.current[0]).toBe('Bob');
});

test('updates localStorage when value changes', () => {
  const { result } = renderHook(() => useLocalStorage('name', 'Alice'));

  act(() => {
    result.current[1]('Charlie');
  });

  expect(result.current[0]).toBe('Charlie');
  expect(JSON.parse(localStorage.getItem('name'))).toBe('Charlie');
});
```

### Example: `useFetch` (Async)

```jsx
// useFetch.js
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [url]);

  return state;
}
```

```jsx
// useFetch.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

// Using MSW to handle the fetch
test('returns data on success', async () => {
  const { result } = renderHook(() => useFetch('/api/users/1'));

  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBeNull();

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data.name).toBe('Alice');
  expect(result.current.error).toBeNull();
});

test('returns error on failure', async () => {
  server.use(
    http.get('/api/users/1', () => HttpResponse.error())
  );

  const { result } = renderHook(() => useFetch('/api/users/1'));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.error).not.toBeNull();
  expect(result.current.data).toBeNull();
});
```

### Example: Hook with Context Dependency

If your hook calls `useContext`, provide the context via a wrapper.

```jsx
test('useAuth reads from AuthContext', () => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={{ user: { name: 'Alice' }, isLoggedIn: true }}>
      {children}
    </AuthContext.Provider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.isLoggedIn).toBe(true);
  expect(result.current.user.name).toBe('Alice');
});
```

---

## 10. Quick Reference Cheatsheet

### Query Decision Tree

```
Does the element exist right now?
├── Yes → getBy...
└── Maybe → queryBy...

Will it appear asynchronously?
└── Yes → findBy... (or await waitFor + getBy)

Multiple elements?
├── getAll, queryAll, findAll
```

### When to Use What

| Scenario | Tool |
|---|---|
| Element must be in DOM | `getBy` |
| Element might not be in DOM | `queryBy` |
| Element appears after async work | `findBy` |
| Assert element is gone | `expect(...).not.toBeInTheDocument()` |
| Wait for async state change | `waitFor(() => expect(...)...)` |
| Wait for element to disappear | `waitForElementToBeRemoved` |
| Simulate typing | `user.type(element, 'text')` |
| Simulate clicking | `user.click(element)` |
| Test hook in isolation | `renderHook` |
| Trigger state update in hook test | `act(() => ...)` |
| Wrap with context | `render(ui, { wrapper: Provider })` |
| Mock network requests | MSW (preferred) or `jest.spyOn` |

### Query Priority

1. `ByRole` — most accessible, most preferred
2. `ByLabelText` — for form elements
3. `ByPlaceholderText` — for inputs without labels
4. `ByText` — for visible text
5. `ByDisplayValue` — for current input values
6. `ByAltText` — for images
7. `ByTitle` — for title attributes
8. `ByTestId` — last resort

### Commonly Used Imports

```jsx
import { render, screen, waitFor, waitForElementToBeRemoved, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // in setup file
```

---

## Further Reading

- [RTL Official Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) — Kent C. Dodds
- [MSW Documentation](https://mswjs.io/docs/)
- [Which Query Should I Use?](https://testing-library.com/docs/queries/about#priority)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom#custom-matchers)

---

*Phase 8 Complete — You now have the tools to write meaningful, maintainable tests that give real confidence in your React applications.*
