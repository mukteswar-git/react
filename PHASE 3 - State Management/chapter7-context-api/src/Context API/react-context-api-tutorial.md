# Day 15-17: React Context API - Complete Tutorial

## Table of Contents
1. [Introduction to Context API](#introduction-to-context-api)
2. [The useContext Hook](#the-usecontext-hook)
3. [Context Provider Pattern](#context-provider-pattern)
4. [When to Use Context](#when-to-use-context)
5. [Context Performance Pitfalls](#context-performance-pitfalls)
6. [Working with Multiple Contexts](#working-with-multiple-contexts)
7. [Context vs Prop Drilling](#context-vs-prop-drilling)
8. [Advanced Patterns](#advanced-patterns)
9. [Best Practices](#best-practices)
10. [Practical Examples](#practical-examples)

---

## Introduction to Context API

The Context API is React's built-in solution for sharing data across the component tree without having to pass props down manually at every level. It's designed to share data that can be considered "global" for a tree of React components.

### Why Context API?

```jsx
// Without Context - Prop Drilling
function App() {
  const [user, setUser] = useState({ name: 'John' });
  return <Parent user={user} />;
}

function Parent({ user }) {
  return <Child user={user} />;
}

function Child({ user }) {
  return <GrandChild user={user} />;
}

function GrandChild({ user }) {
  return <div>{user.name}</div>;
}
```

```jsx
// With Context - Direct Access
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John' });
  return (
    <UserContext.Provider value={user}>
      <Parent />
    </UserContext.Provider>
  );
}

function GrandChild() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

---

## The useContext Hook

The `useContext` hook allows you to consume context values in functional components.

### Basic Syntax

```jsx
import { createContext, useContext } from 'react';

// 1. Create a context
const MyContext = createContext(defaultValue);

// 2. Use the context in a component
function MyComponent() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

### Complete Example

```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333'
      }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}

export default App;
```

### Default Values

```jsx
// Default value is used when no Provider is found
const ThemeContext = createContext('light');

function ComponentWithoutProvider() {
  const theme = useContext(ThemeContext);
  return <div>Theme: {theme}</div>; // Will show 'light'
}
```

---

## Context Provider Pattern

The Provider pattern is the standard way to organize Context in React applications.

### Basic Provider Pattern

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Custom hook for consuming context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      const user = await fakeLoginAPI(email, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Usage
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Provider with Reducer Pattern

```jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Actions
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM:
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => {
    dispatch({ type: ADD_ITEM, payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

---

## When to Use Context

### ✅ Good Use Cases

1. **Theme/UI Preferences**
```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

2. **User Authentication**
```jsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
```

3. **Localization/i18n**
```jsx
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

4. **Application Configuration**
```jsx
const ConfigContext = createContext();

function ConfigProvider({ children }) {
  const config = {
    apiUrl: process.env.REACT_APP_API_URL,
    features: {
      darkMode: true,
      notifications: true
    }
  };
  
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
```

### ❌ When NOT to Use Context

1. **Frequently Changing Values**
```jsx
// BAD - This will cause unnecessary re-renders
function MousePositionProvider({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return (
    <MouseContext.Provider value={position}>
      {children}
    </MouseContext.Provider>
  );
}

// BETTER - Use local state or refs
function ComponentNeedingMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Handle locally
}
```

2. **Simple Prop Drilling (1-2 levels)**
```jsx
// If only passing through 1-2 levels, props are fine
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} />;
}

function Child({ count }) {
  return <GrandChild count={count} />;
}
```

3. **Component-Specific State**
```jsx
// BAD - Form state in Context
// GOOD - Keep form state local to the form component
function FormComponent() {
  const [formData, setFormData] = useState({});
  // Handle locally
}
```

---

## Context Performance Pitfalls

### Problem 1: Unnecessary Re-renders

```jsx
// ❌ BAD - Creates new object on every render
function BadProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ GOOD - Memoize the value
function GoodProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const value = useMemo(() => ({ user, setUser }), [user]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### Problem 2: Large Context Values

```jsx
// ❌ BAD - Single large context
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  
  // Any change causes all consumers to re-render!
  const value = useMemo(
    () => ({ user, setUser, theme, setTheme, notifications, setNotifications, settings, setSettings }),
    [user, theme, notifications, settings]
  );
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ✅ GOOD - Split into separate contexts
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
```

### Solution: Split Context by Update Frequency

```jsx
// Separate rarely-changing data from frequently-changing data
const UserContext = createContext(); // Changes rarely
const NotificationsContext = createContext(); // Changes frequently

function Providers({ children }) {
  return (
    <UserProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </UserProvider>
  );
}
```

### Solution: Context Selector Pattern

```jsx
import { createContext, useContext, useMemo, useRef, useSyncExternalStore } from 'react';

function createContextSelector() {
  const Context = createContext(null);
  
  function Provider({ value, children }) {
    const valueRef = useRef(value);
    const subscribersRef = useRef(new Set());
    
    valueRef.current = value;
    
    const contextValue = useMemo(() => ({
      subscribe: (callback) => {
        subscribersRef.current.add(callback);
        return () => subscribersRef.current.delete(callback);
      },
      getValue: () => valueRef.current
    }), []);
    
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  }
  
  function useSelector(selector) {
    const context = useContext(Context);
    
    return useSyncExternalStore(
      context.subscribe,
      () => selector(context.getValue()),
      () => selector(context.getValue())
    );
  }
  
  return { Provider, useSelector };
}

// Usage
const { Provider: StoreProvider, useSelector } = createContextSelector();

function App() {
  const [state, setState] = useState({
    user: { name: 'John', age: 30 },
    theme: 'light',
    count: 0
  });
  
  return (
    <StoreProvider value={state}>
      <UserDisplay />
      <ThemeDisplay />
    </StoreProvider>
  );
}

function UserDisplay() {
  // Only re-renders when user changes
  const user = useSelector(state => state.user);
  return <div>{user.name}</div>;
}

function ThemeDisplay() {
  // Only re-renders when theme changes
  const theme = useSelector(state => state.theme);
  return <div>Theme: {theme}</div>;
}
```

---

## Working with Multiple Contexts

### Pattern 1: Nested Providers

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router>
              <Routes />
            </Router>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### Pattern 2: Compose Providers

```jsx
function ComposeProviders({ providers, children }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

// Usage
function App() {
  return (
    <ComposeProviders
      providers={[
        AuthProvider,
        ThemeProvider,
        LanguageProvider,
        NotificationProvider
      ]}
    >
      <Router>
        <Routes />
      </Router>
    </ComposeProviders>
  );
}
```

### Pattern 3: Custom Providers Component

```jsx
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes />
      </Router>
    </AppProviders>
  );
}
```

### Consuming Multiple Contexts

```jsx
function UserProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { showNotification } = useNotifications();
  
  const handleSave = () => {
    showNotification(t('profile.saved'));
  };
  
  return (
    <div className={`profile-${theme}`}>
      <h1>{t('profile.title')}</h1>
      <p>{user.name}</p>
      <button onClick={handleSave}>{t('profile.save')}</button>
    </div>
  );
}
```

---

## Context vs Prop Drilling

### Prop Drilling Example

```jsx
// Need to pass user through multiple levels
function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return (
    <div>
      <Sidebar user={user} />
      <MainContent user={user} setUser={setUser} />
    </div>
  );
}

function Sidebar({ user }) {
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }) {
  return <div>{user.name} ({user.role})</div>;
}

function MainContent({ user, setUser }) {
  return <Settings user={user} setUser={setUser} />;
}

function Settings({ user, setUser }) {
  return <ProfileEditor user={user} setUser={setUser} />;
}

function ProfileEditor({ user, setUser }) {
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
    </form>
  );
}
```

### Context Solution

```jsx
const UserContext = createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  
  const value = useMemo(() => ({ user, setUser }), [user]);
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Clean component tree
function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

function Dashboard() {
  return (
    <div>
      <Sidebar />
      <MainContent />
    </div>
  );
}

function Sidebar() {
  return <UserMenu />;
}

function UserMenu() {
  return <UserProfile />;
}

function UserProfile() {
  const { user } = useUser();
  return <div>{user.name} ({user.role})</div>;
}

function MainContent() {
  return <Settings />;
}

function Settings() {
  return <ProfileEditor />;
}

function ProfileEditor() {
  const { user, setUser } = useUser();
  
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
    </form>
  );
}
```

### Decision Matrix: Context vs Props

| Scenario | Use Props | Use Context |
|----------|-----------|-------------|
| Passing data 1-2 levels | ✅ | ❌ |
| Passing data 3+ levels | ❌ | ✅ |
| Data needed by many components | ❌ | ✅ |
| Component composition | ✅ | ❌ |
| Frequently changing values | ✅ | ⚠️ |
| Global app state | ❌ | ✅ |
| Reusable components | ✅ | ❌ |

---

## Advanced Patterns

### Pattern 1: Context with Local Storage

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const LocalStorageContext = createContext();

export function useLocalStorage() {
  return useContext(LocalStorageContext);
}

export function LocalStorageProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const value = { theme, setTheme };
  
  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}
```

### Pattern 2: Context with API Integration

```jsx
const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const value = {
    data,
    loading,
    error,
    refetch: fetchData
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
```

### Pattern 3: Compound Context Pattern

```jsx
const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Expose as compound component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;

// Usage
function App() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panel value="tab1">
        <h2>Content 1</h2>
      </Tabs.Panel>
      
      <Tabs.Panel value="tab2">
        <h2>Content 2</h2>
      </Tabs.Panel>
    </Tabs>
  );
}
```

---

## Best Practices

### 1. Always Provide a Custom Hook

```jsx
// ✅ GOOD
const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  // ...
}

// ❌ BAD - Direct context export
export const ThemeContext = createContext();
```

### 2. Memoize Context Values

```jsx
// ✅ GOOD
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  const value = useMemo(
    () => ({ state, setState }),
    [state]
  );
  
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// ❌ BAD
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}
```

### 3. Split Contexts by Concern

```jsx
// ✅ GOOD
<AuthProvider>
  <ThemeProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
</AuthProvider>

// ❌ BAD - Everything in one context
<AppProvider> {/* Contains auth, theme, notifications, etc. */}
  <App />
</AppProvider>
```

### 4. Provide Meaningful Default Values

```jsx
// ✅ GOOD
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {
    console.warn('setTheme called outside ThemeProvider');
  }
});

// ❌ BAD
const ThemeContext = createContext(undefined);
```

### 5. Document Your Context

```jsx
/**
 * AuthContext provides authentication state and methods
 * 
 * @example
 * function MyComponent() {
 *   const { user, login, logout } = useAuth();
 *   // ...
 * }
 */
export function AuthProvider({ children }) {
  // ...
}
```

---

## Practical Examples

### Example 1: Complete Theme System

```jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff',
    secondary: '#6c757d'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#0d6efd',
    secondary: '#adb5bd'
  }
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', themeName);
    document.body.className = themeName;
  }, [themeName]);
  
  const theme = themes[themeName];
  
  const toggleTheme = () => {
    setThemeName(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = useMemo(
    () => ({
      theme,
      themeName,
      setThemeName,
      toggleTheme
    }),
    [theme, themeName]
  );
  
  return (
    <ThemeContext.Provider value={value}>
      <div
        style={{
          background: theme.background,
          color: theme.text,
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Usage Components
function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {themeName} - Click to toggle
    </button>
  );
}

function ThemedCard({ children }) {
  const { theme } = useTheme();
  
  return (
    <div
      style={{
        background: theme.background,
        color: theme.text,
        border: `1px solid ${theme.primary}`,
        padding: '1rem',
        borderRadius: '8px'
      }}
    >
      {children}
    </div>
  );
}
```

### Example 2: Shopping Cart with Context

```jsx
import { createContext, useContext, useReducer, useMemo } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        };
        return { ...state, items: newItems };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: newItems };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const value = useMemo(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }),
    [state.items, totalItems, totalPrice]
  );
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Usage Components
function ProductList() {
  const { addItem } = useCart();
  
  const products = [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 39.99 }
  ];
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addItem(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  
  if (items.length === 0) {
    return <p>Your cart is empty</p>;
  }
  
  return (
    <div>
      <h2>Cart ({totalItems} items)</h2>
      {items.map(item => (
        <div key={item.id}>
          <h4>{item.name}</h4>
          <p>${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
    </div>
  );
}
```

### Example 3: Multi-Step Form with Context

```jsx
import { createContext, useContext, useState, useMemo } from 'react';

const FormContext = createContext();

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}

export function FormProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {},
    address: {},
    preferences: {}
  });
  
  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const goToStep = (step) => setCurrentStep(step);
  
  const value = useMemo(
    () => ({
      currentStep,
      formData,
      updateFormData,
      nextStep,
      prevStep,
      goToStep
    }),
    [currentStep, formData]
  );
  
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Step Components
function PersonalInfoStep() {
  const { formData, updateFormData, nextStep } = useForm();
  const [localData, setLocalData] = useState(formData.personalInfo);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData('personalInfo', localData);
    nextStep();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Personal Information</h2>
      <input
        type="text"
        placeholder="Name"
        value={localData.name || ''}
        onChange={(e) => setLocalData({ ...localData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={localData.email || ''}
        onChange={(e) => setLocalData({ ...localData, email: e.target.value })}
      />
      <button type="submit">Next</button>
    </form>
  );
}

function AddressStep() {
  const { formData, updateFormData, nextStep, prevStep } = useForm();
  const [localData, setLocalData] = useState(formData.address);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData('address', localData);
    nextStep();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Address</h2>
      <input
        type="text"
        placeholder="Street"
        value={localData.street || ''}
        onChange={(e) => setLocalData({ ...localData, street: e.target.value })}
      />
      <input
        type="text"
        placeholder="City"
        value={localData.city || ''}
        onChange={(e) => setLocalData({ ...localData, city: e.target.value })}
      />
      <button type="button" onClick={prevStep}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

function ReviewStep() {
  const { formData, prevStep } = useForm();
  
  const handleSubmit = () => {
    console.log('Final submission:', formData);
    alert('Form submitted!');
  };
  
  return (
    <div>
      <h2>Review Your Information</h2>
      <div>
        <h3>Personal Info</h3>
        <p>Name: {formData.personalInfo.name}</p>
        <p>Email: {formData.personalInfo.email}</p>
      </div>
      <div>
        <h3>Address</h3>
        <p>Street: {formData.address.street}</p>
        <p>City: {formData.address.city}</p>
      </div>
      <button onClick={prevStep}>Back</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// Main Form Component
function MultiStepForm() {
  const { currentStep } = useForm();
  
  const steps = [
    <PersonalInfoStep />,
    <AddressStep />,
    <ReviewStep />
  ];
  
  return (
    <div>
      <div>Step {currentStep + 1} of {steps.length}</div>
      {steps[currentStep]}
    </div>
  );
}

// App
function App() {
  return (
    <FormProvider>
      <MultiStepForm />
    </FormProvider>
  );
}
```

---

## Summary

### Key Takeaways

1. **Context API** is perfect for sharing data across many components without prop drilling
2. **useContext** hook provides a clean way to consume context values
3. **Always memoize** context values to prevent unnecessary re-renders
4. **Split contexts** by concern and update frequency
5. **Custom hooks** make context consumption easier and safer
6. **Context is not a replacement** for all state management needs
7. **Performance matters** - be careful with frequently changing values

### When to Use What

- **Props**: 1-2 levels deep, component composition
- **Context**: Global/shared state, 3+ levels deep
- **State Management Library**: Complex state logic, high-frequency updates

### Next Steps

- Practice building apps with Context
- Experiment with multiple contexts
- Learn about state management libraries (Redux, Zustand)
- Explore React Server Components and their relationship with Context
- Study performance optimization techniques

---

## Additional Resources

- [React Context Documentation](https://react.dev/reference/react/useContext)
- [Kent C. Dodds - Application State Management](https://kentcdodds.com/blog/application-state-management-with-react)
- [React TypeScript Cheatsheet - Context](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/)

---

**Happy Coding! 🚀**
