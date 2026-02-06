# Day 13-14: Advanced React Patterns

## Table of Contents
1. [Custom Hooks Creation](#custom-hooks-creation)
2. [Compound Components Pattern](#compound-components-pattern)
3. [Render Props Pattern](#render-props-pattern)
4. [Higher-Order Components (HOC)](#higher-order-components-hoc)
5. [Children Prop Patterns](#children-prop-patterns)
6. [Composition vs Inheritance](#composition-vs-inheritance)
7. [Practice Projects](#practice-projects)

---

## Custom Hooks Creation

Custom hooks allow you to extract component logic into reusable functions. They follow the naming convention `use*` and can use other hooks.

### Why Custom Hooks?

- Reuse stateful logic between components
- Clean up component code
- Share logic across the application
- Better separation of concerns

### Basic Custom Hook Example

```jsx
// useCounter.js
import { useState } from 'react';

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage
function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(0, 5);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+5</button>
      <button onClick={decrement}>-5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Advanced Custom Hooks

#### useLocalStorage Hook

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('username', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter name"
      />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme: {theme}
      </button>
    </div>
  );
}
```

#### useFetch Hook

```jsx
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### useToggle Hook

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }];
}

// Usage
function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <div>
      <button onClick={setTrue}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={setFalse}>Close</button>
          <button onClick={toggle}>Toggle</button>
        </div>
      )}
    </div>
  );
}
```

#### useDebounce Hook

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## Compound Components Pattern

Compound components work together to form a complete UI component. They share implicit state and communicate with each other.

### Why Compound Components?

- Better component API
- Flexible composition
- Cleaner JSX
- Implicit state sharing

### Basic Example: Toggle Component

```jsx
import { createContext, useContext, useState } from 'react';

// Create context for shared state
const ToggleContext = createContext();

// Main compound component
function Toggle({ children, onToggle }) {
  const [on, setOn] = useState(false);

  const toggle = () => {
    setOn(prev => {
      const newState = !prev;
      onToggle?.(newState);
      return newState;
    });
  };

  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

// Sub-components
Toggle.On = function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
};

Toggle.Off = function ToggleOff({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
};

Toggle.Button = function ToggleButton({ children, ...props }) {
  const { on, toggle } = useContext(ToggleContext);
  return (
    <button onClick={toggle} {...props}>
      {children || (on ? 'ON' : 'OFF')}
    </button>
  );
};

Toggle.Status = function ToggleStatus() {
  const { on } = useContext(ToggleContext);
  return <span>The toggle is {on ? 'on' : 'off'}</span>;
};

// Usage
function App() {
  return (
    <Toggle onToggle={(state) => console.log('Toggled:', state)}>
      <Toggle.Status />
      <Toggle.On>
        <div style={{ background: 'green', padding: '20px' }}>
          The button is ON
        </div>
      </Toggle.On>
      <Toggle.Off>
        <div style={{ background: 'red', padding: '20px' }}>
          The button is OFF
        </div>
      </Toggle.Off>
      <Toggle.Button />
    </Toggle>
  );
}
```

### Advanced Example: Accordion Component

```jsx
import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();

function Accordion({ children, defaultIndex = null, allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState(
    defaultIndex !== null ? [defaultIndex] : []
  );

  const toggleItem = (index) => {
    setOpenIndexes(prev => {
      if (allowMultiple) {
        return prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index];
      } else {
        return prev.includes(index) ? [] : [index];
      }
    });
  };

  const isOpen = (index) => openIndexes.includes(index);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ children, index }) {
  return (
    <div className="accordion-item">
      {typeof children === 'function'
        ? children(index)
        : children}
    </div>
  );
};

Accordion.Header = function AccordionHeader({ children, index }) {
  const { toggleItem, isOpen } = useContext(AccordionContext);
  
  return (
    <div
      className="accordion-header"
      onClick={() => toggleItem(index)}
      style={{ 
        cursor: 'pointer', 
        padding: '10px',
        background: isOpen(index) ? '#e0e0e0' : '#f5f5f5',
        borderBottom: '1px solid #ccc'
      }}
    >
      {children}
      <span style={{ float: 'right' }}>
        {isOpen(index) ? '▲' : '▼'}
      </span>
    </div>
  );
};

Accordion.Panel = function AccordionPanel({ children, index }) {
  const { isOpen } = useContext(AccordionContext);
  
  if (!isOpen(index)) return null;
  
  return (
    <div className="accordion-panel" style={{ padding: '15px' }}>
      {children}
    </div>
  );
};

// Usage
function FAQPage() {
  return (
    <Accordion defaultIndex={0} allowMultiple={false}>
      <Accordion.Item index={0}>
        <Accordion.Header index={0}>
          What is React?
        </Accordion.Header>
        <Accordion.Panel index={0}>
          React is a JavaScript library for building user interfaces.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item index={1}>
        <Accordion.Header index={1}>
          What are Hooks?
        </Accordion.Header>
        <Accordion.Panel index={1}>
          Hooks are functions that let you use state and other React features.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item index={2}>
        <Accordion.Header index={2}>
          What is JSX?
        </Accordion.Header>
        <Accordion.Panel index={2}>
          JSX is a syntax extension for JavaScript that looks similar to HTML.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

## Render Props Pattern

A technique for sharing code between components using a prop whose value is a function.

### Why Render Props?

- Share stateful logic
- More flexible than HOCs
- Explicit data flow
- Better TypeScript support

### Basic Example: Mouse Tracker

```jsx
import { useState } from 'react';

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ height: '100vh', border: '1px solid black' }}
    >
      {render(position)}
    </div>
  );
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <h1>Move your mouse around!</h1>
          <p>Current position: ({x}, {y})</p>
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: '20px',
              height: '20px',
              background: 'red',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      )}
    />
  );
}
```

### Using Children as Function

```jsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading, error });
}

// Usage
function UserList() {
  return (
    <DataFetcher url="https://jsonplaceholder.typicode.com/users">
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        
        return (
          <ul>
            {data?.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }}
    </DataFetcher>
  );
}
```

### Advanced Example: List with Virtualization

```jsx
import { useState, useRef, useEffect } from 'react';

function VirtualList({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      containerHeight={400}
      renderItem={(item, index) => (
        <div style={{ 
          padding: '10px', 
          borderBottom: '1px solid #ccc',
          background: index % 2 === 0 ? '#f9f9f9' : 'white'
        }}>
          {item}
        </div>
      )}
    />
  );
}
```

---

## Higher-Order Components (HOC)

A higher-order component is a function that takes a component and returns a new component with additional props or behavior.

### Why HOCs?

- Reuse component logic
- Props manipulation
- Conditional rendering
- Side effects abstraction

### Basic Example: withLoading HOC

```jsx
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="spinner">Loading...</div>
        </div>
      );
    }
    return <Component {...props} />;
  };
}

// Original component
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Enhanced component
const UserListWithLoading = withLoading(UserList);

// Usage
function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return <UserListWithLoading isLoading={loading} users={users} />;
}
```

### Advanced HOC: withAuth

```jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function withAuth(Component, options = {}) {
  return function WithAuthComponent(props) {
    const navigate = useNavigate();
    const { requiredRole = null, redirectTo = '/login' } = options;
    
    // Simulated auth check (replace with real auth logic)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuthenticated = !!user;
    const hasRequiredRole = !requiredRole || user?.role === requiredRole;

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(redirectTo);
      } else if (!hasRequiredRole) {
        navigate('/unauthorized');
      }
    }, [isAuthenticated, hasRequiredRole, navigate]);

    if (!isAuthenticated || !hasRequiredRole) {
      return null;
    }

    return <Component {...props} user={user} />;
  };
}

// Usage
function Dashboard({ user }) {
  return <h1>Welcome, {user.name}!</h1>;
}

function AdminPanel({ user }) {
  return <h1>Admin Panel - {user.name}</h1>;
}

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAdminPanel = withAuth(AdminPanel, { requiredRole: 'admin' });
```

### Composing Multiple HOCs

```jsx
function withLogger(Component) {
  return function WithLoggerComponent(props) {
    useEffect(() => {
      console.log('Component mounted with props:', props);
      return () => console.log('Component unmounted');
    }, []);

    return <Component {...props} />;
  };
}

function withErrorBoundary(Component) {
  return class WithErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong: {this.state.error.message}</div>;
      }
      return <Component {...this.props} />;
    }
  };
}

function withTheme(Component) {
  return function WithThemeComponent(props) {
    const [theme, setTheme] = useState('light');
    
    return (
      <Component 
        {...props} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
      />
    );
  };
}

// Compose multiple HOCs
const enhance = (Component) => 
  withLogger(
    withErrorBoundary(
      withTheme(
        withLoading(Component)
      )
    )
  );

const EnhancedComponent = enhance(MyComponent);
```

---

## Children Prop Patterns

The children prop is a special prop that allows you to pass components or elements as data to other components.

### Basic Children Usage

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="User Profile">
      <img src="avatar.jpg" alt="Avatar" />
      <h3>John Doe</h3>
      <p>Software Developer</p>
    </Card>
  );
}
```

### Manipulating Children

```jsx
import { Children, cloneElement } from 'react';

function List({ children, className }) {
  return (
    <ul className={className}>
      {Children.map(children, (child, index) => {
        // Add additional props to each child
        return cloneElement(child, {
          index,
          className: `list-item ${child.props.className || ''}`
        });
      })}
    </ul>
  );
}

function ListItem({ children, index, className, highlighted }) {
  return (
    <li 
      className={className}
      style={{ 
        background: highlighted ? 'yellow' : 'transparent',
        padding: '10px'
      }}
    >
      {index + 1}. {children}
    </li>
  );
}

// Usage
function App() {
  return (
    <List className="my-list">
      <ListItem>First item</ListItem>
      <ListItem highlighted>Second item (highlighted)</ListItem>
      <ListItem>Third item</ListItem>
    </List>
  );
}
```

### Container/Presenter Pattern

```jsx
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Extract tabs from children
  const tabs = Children.toArray(children);

  return (
    <div className="tabs">
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'active' : ''}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab]}
      </div>
    </div>
  );
}

function Tab({ children, label }) {
  return <div className="tab-panel">{children}</div>;
}

// Usage
function App() {
  return (
    <Tabs defaultTab={0}>
      <Tab label="Profile">
        <h2>Profile Information</h2>
        <p>Name: John Doe</p>
      </Tab>
      <Tab label="Settings">
        <h2>Settings</h2>
        <p>Theme: Dark</p>
      </Tab>
      <Tab label="Notifications">
        <h2>Notifications</h2>
        <p>You have 5 new notifications</p>
      </Tab>
    </Tabs>
  );
}
```

### Slot Pattern

```jsx
function Layout({ header, sidebar, content, footer }) {
  return (
    <div className="layout">
      {header && <header className="header">{header}</header>}
      <div className="main">
        {sidebar && <aside className="sidebar">{sidebar}</aside>}
        <main className="content">{content}</main>
      </div>
      {footer && <footer className="footer">{footer}</footer>}
    </div>
  );
}

// Usage
function App() {
  return (
    <Layout
      header={
        <nav>
          <h1>My App</h1>
          <ul>
            <li>Home</li>
            <li>About</li>
          </ul>
        </nav>
      }
      sidebar={
        <div>
          <h3>Navigation</h3>
          <ul>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </div>
      }
      content={
        <div>
          <h2>Welcome!</h2>
          <p>This is the main content area.</p>
        </div>
      }
      footer={
        <p>&copy; 2024 My Company</p>
      }
    />
  );
}
```

---

## Composition vs Inheritance

React recommends composition over inheritance for code reuse. Let's explore why and how.

### Why Composition Over Inheritance?

- More flexible
- Easier to understand
- Better component reusability
- Avoids deep inheritance chains
- Clearer data flow

### Inheritance (Not Recommended)

```jsx
// ❌ Avoid this pattern
class Button extends React.Component {
  render() {
    return <button>{this.props.children}</button>;
  }
}

class FancyButton extends Button {
  render() {
    return (
      <button className="fancy">
        {this.props.children}
      </button>
    );
  }
}
```

### Composition (Recommended)

```jsx
// ✅ Use composition instead
function Button({ children, className, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function FancyButton({ children, ...props }) {
  return (
    <Button className="fancy" {...props}>
      {children}
    </Button>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <Button className="primary" {...props}>
      {children}
    </Button>
  );
}
```

### Specialization Through Composition

```jsx
// Generic Dialog component
function Dialog({ title, children, footer }) {
  return (
    <div className="dialog">
      <div className="dialog-header">
        <h2>{title}</h2>
      </div>
      <div className="dialog-content">
        {children}
      </div>
      {footer && (
        <div className="dialog-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// Specialized components using composition
function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      footer={
        <button>Get Started</button>
      }
    >
      <p>Thank you for visiting our spacecraft!</p>
    </Dialog>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Dialog
      title="Confirm Action"
      footer={
        <>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </>
      }
    >
      <p>{message}</p>
    </Dialog>
  );
}
```

### Containment

```jsx
function FancyBorder({ color, children }) {
  return (
    <div className={`fancy-border fancy-border-${color}`}>
      {children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="dialog-title">Welcome</h1>
      <p className="dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

### Component Composition Patterns

```jsx
// Base components
function Panel({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white border',
    primary: 'bg-blue-500 text-white',
    danger: 'bg-red-500 text-white'
  };

  return (
    <div className={`panel ${variants[variant]} p-4 rounded`}>
      {children}
    </div>
  );
}

function PanelHeader({ children }) {
  return <div className="panel-header font-bold mb-2">{children}</div>;
}

function PanelBody({ children }) {
  return <div className="panel-body">{children}</div>;
}

function PanelFooter({ children }) {
  return <div className="panel-footer mt-2 pt-2 border-t">{children}</div>;
}

// Compose complex components
function UserCard({ user }) {
  return (
    <Panel variant="default">
      <PanelHeader>
        {user.name}
      </PanelHeader>
      <PanelBody>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </PanelBody>
      <PanelFooter>
        <button>View Profile</button>
        <button>Send Message</button>
      </PanelFooter>
    </Panel>
  );
}

function AlertCard({ title, message, type = 'info' }) {
  return (
    <Panel variant={type === 'error' ? 'danger' : 'primary'}>
      <PanelHeader>{title}</PanelHeader>
      <PanelBody>{message}</PanelBody>
      <PanelFooter>
        <button>Dismiss</button>
      </PanelFooter>
    </Panel>
  );
}
```

---

## Practice Projects

### Project 1: Multi-Step Form

Create a multi-step form using compound components:

```jsx
import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

function MultiStepForm({ children, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = Children.toArray(children);
  const isLastStep = currentStep === steps.length - 1;

  const next = () => {
    if (!isLastStep) setCurrentStep(prev => prev + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      next, 
      prev, 
      isLastStep,
      currentStep,
      totalSteps: steps.length
    }}>
      <div className="multi-step-form">
        <div className="progress-bar">
          Step {currentStep + 1} of {steps.length}
        </div>
        {steps[currentStep]}
        <div className="form-navigation">
          {currentStep > 0 && <button onClick={prev}>Previous</button>}
          {!isLastStep ? (
            <button onClick={next}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </FormContext.Provider>
  );
}

MultiStepForm.Step = function FormStep({ children }) {
  return <div className="form-step">{children}</div>;
};

// Usage
function RegistrationForm() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <MultiStepForm onSubmit={handleSubmit}>
      <MultiStepForm.Step>
        <PersonalInfoStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step>
        <AddressStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step>
        <ConfirmationStep />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}

function PersonalInfoStep() {
  const { formData, updateFormData } = useContext(FormContext);

  return (
    <div>
      <h2>Personal Information</h2>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName || ''}
        onChange={(e) => updateFormData({ firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName || ''}
        onChange={(e) => updateFormData({ lastName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email || ''}
        onChange={(e) => updateFormData({ email: e.target.value })}
      />
    </div>
  );
}
```

### Project 2: Data Table with Sorting and Filtering

Build a reusable data table using render props:

```jsx
import { useState, useMemo } from 'react';

function DataTable({ 
  data, 
  columns, 
  renderRow,
  itemsPerPage = 10 
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      columns.some(col =>
        String(item[col.key])
          .toLowerCase()
          .includes(filterText.toLowerCase())
      )
    );
  }, [data, filterText, columns]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="data-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th 
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: 'pointer' }}
              >
                {col.label}
                {sortColumn === col.key && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Usage
function UserTable() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    // ... more users
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      itemsPerPage={5}
      renderRow={(user, index) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
        </tr>
      )}
    />
  );
}
```

### Project 3: Customizable Dashboard

Create a dashboard layout using composition:

```jsx
function Dashboard({ children }) {
  return (
    <div className="dashboard" style={{ 
      display: 'grid',
      gap: '20px',
      padding: '20px'
    }}>
      {children}
    </div>
  );
}

Dashboard.Row = function DashboardRow({ children }) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    }}>
      {children}
    </div>
  );
};

Dashboard.Widget = function Widget({ title, children, actions }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      background: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <h3>{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  );
};

// Usage
function MyDashboard() {
  return (
    <Dashboard>
      <Dashboard.Row>
        <Dashboard.Widget 
          title="Sales Overview"
          actions={<button>Export</button>}
        >
          <p>Total Sales: $45,000</p>
          <p>Growth: +15%</p>
        </Dashboard.Widget>

        <Dashboard.Widget title="Recent Orders">
          <ul>
            <li>Order #1234 - $500</li>
            <li>Order #1235 - $750</li>
          </ul>
        </Dashboard.Widget>
      </Dashboard.Row>

      <Dashboard.Row>
        <Dashboard.Widget title="User Analytics">
          <p>Active Users: 1,234</p>
          <p>New Users Today: 45</p>
        </Dashboard.Widget>
      </Dashboard.Row>
    </Dashboard>
  );
}
```

---

## Key Takeaways

1. **Custom Hooks**: Extract and reuse stateful logic across components
2. **Compound Components**: Build flexible, composable UI components with implicit state sharing
3. **Render Props**: Share code between components using a function prop
4. **HOCs**: Enhance components with additional functionality
5. **Children Patterns**: Leverage the children prop for flexible composition
6. **Composition over Inheritance**: Build reusable components through composition

## Best Practices

- Use custom hooks for reusable stateful logic
- Prefer compound components for complex, related UI elements
- Use render props when you need explicit control over rendering
- Keep HOCs simple and focused on a single concern
- Leverage composition for code reuse instead of inheritance
- Choose the right pattern based on your specific use case

## Next Steps

- Practice building custom hooks for your common use cases
- Experiment with compound components for your UI library
- Compare different patterns and understand when to use each
- Refactor existing components using these advanced patterns
- Build a component library using composition patterns
