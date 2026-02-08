# Day 18-19: useReducer - Complete Tutorial

## Table of Contents
1. [Introduction to useReducer](#introduction-to-usereducer)
2. [The Reducer Pattern](#the-reducer-pattern)
3. [Actions and Action Creators](#actions-and-action-creators)
4. [useReducer vs useState](#usereducer-vs-usestate)
5. [Combining useReducer with useContext](#combining-usereducer-with-usecontext)
6. [Complex State Logic Examples](#complex-state-logic-examples)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

---

## Introduction to useReducer

`useReducer` is a React Hook that lets you manage complex state logic in your components. It's an alternative to `useState` and is particularly useful when you have state that involves multiple sub-values or when the next state depends on the previous one.

### Basic Syntax

```javascript
const [state, dispatch] = useReducer(reducer, initialState, init?);
```

**Parameters:**
- `reducer`: A function that determines how state gets updated
- `initialState`: The initial state value
- `init` (optional): A function to lazily initialize state

**Returns:**
- `state`: The current state value
- `dispatch`: A function to trigger state updates

### Simple Example

```javascript
import { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

---

## The Reducer Pattern

A reducer is a pure function that takes the current state and an action, then returns the new state. The pattern comes from Redux and functional programming.

### Reducer Function Rules

1. **Pure Function**: No side effects, same input always produces same output
2. **Immutable Updates**: Never mutate state directly, always return new objects
3. **Single Source of Truth**: The reducer is the only way to update state

### Anatomy of a Reducer

```javascript
function reducer(state, action) {
  // 1. Check the action type
  // 2. Calculate new state based on action
  // 3. Return new state (never mutate!)
  
  switch (action.type) {
    case 'ACTION_TYPE':
      return {
        ...state,
        // updated properties
      };
    default:
      return state;
  }
}
```

### Complete Example: Todo List

```javascript
import { useReducer } from 'react';

// Initial state
const initialState = {
  todos: [],
  filter: 'all' // all, active, completed
};

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', payload: input });
      setInput('');
    }
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          All
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          Active
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          Completed
        </button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
        Clear Completed
      </button>
    </div>
  );
}
```

---

## Actions and Action Creators

### What are Actions?

Actions are plain JavaScript objects that describe what happened. They must have a `type` property and can optionally include a `payload`.

```javascript
// Simple action
{ type: 'INCREMENT' }

// Action with payload
{ type: 'ADD_TODO', payload: 'Learn useReducer' }

// Action with multiple properties
{
  type: 'UPDATE_USER',
  payload: {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
  }
}
```

### Action Types as Constants

It's a best practice to define action types as constants to avoid typos:

```javascript
// actionTypes.js
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const SET_FILTER = 'SET_FILTER';

// Using them
import { ADD_TODO, TOGGLE_TODO } from './actionTypes';

function todoReducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      // ...
    case TOGGLE_TODO:
      // ...
    default:
      return state;
  }
}
```

### Action Creators

Action creators are functions that create and return action objects. They make your code more maintainable and reusable.

```javascript
// Action creators
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: text
});

const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  payload: id
});

const deleteTodo = (id) => ({
  type: 'DELETE_TODO',
  payload: id
});

const setFilter = (filter) => ({
  type: 'SET_FILTER',
  payload: filter
});

// Usage in component
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <div>
      <button onClick={() => dispatch(addTodo('New task'))}>
        Add Todo
      </button>
      <button onClick={() => dispatch(toggleTodo(123))}>
        Toggle
      </button>
      <button onClick={() => dispatch(setFilter('active'))}>
        Show Active
      </button>
    </div>
  );
}
```

### Advanced Action Creators with Validation

```javascript
// Action creators with validation
const createAction = (type) => (payload) => {
  if (payload === undefined) {
    throw new Error(`Action ${type} requires a payload`);
  }
  return { type, payload };
};

const addUser = (userData) => {
  if (!userData.name || !userData.email) {
    throw new Error('User must have name and email');
  }
  return {
    type: 'ADD_USER',
    payload: userData
  };
};

// Async action creator (returns a function for thunk-like pattern)
const fetchUser = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_START' });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_ERROR', payload: error.message });
    }
  };
};
```

---

## useReducer vs useState

### When to Use useState

Use `useState` when:
- State is simple (string, number, boolean)
- State updates are independent
- You have 1-3 state variables
- State logic is straightforward

```javascript
function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

### When to Use useReducer

Use `useReducer` when:
- State has complex structure (objects with multiple fields)
- State updates are interdependent
- Next state depends on previous state
- You have complex update logic
- You want to separate state logic from component

```javascript
function ComplexForm() {
  const [state, dispatch] = useReducer(formReducer, {
    values: { name: '', email: '', age: '' },
    errors: {},
    touched: {},
    isSubmitting: false,
    submitCount: 0
  });

  // Much cleaner than managing 5 separate useState calls!
}
```

### Side-by-Side Comparison

#### useState Version

```javascript
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchPosts = async (userId) => {
    setPostsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setPosts(data);
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
    }
  };

  // ... component logic
}
```

#### useReducer Version

```javascript
const initialState = {
  user: null,
  loading: false,
  error: null,
  posts: [],
  postsLoading: false
};

function userReducer(state, action) {
  switch (action.type) {
    case 'FETCH_USER_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_POSTS_START':
      return { ...state, postsLoading: true };
    case 'FETCH_POSTS_SUCCESS':
      return { ...state, postsLoading: false, posts: action.payload };
    default:
      return state;
  }
}

function UserProfile() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const fetchUser = async (id) => {
    dispatch({ type: 'FETCH_USER_START' });
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_USER_ERROR', payload: err.message });
    }
  };

  // Much more organized!
}
```

### Migration Example: useState → useReducer

```javascript
// BEFORE: Multiple useState
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0.08);

  const addItem = (item) => {
    setItems([...items, item]);
    setTotal(total + item.price);
  };

  const removeItem = (id) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    setTotal(total - item.price);
  };
}

// AFTER: Single useReducer
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    discount: 0,
    taxRate: 0.08
  });

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - item.price
      };
    default:
      return state;
  }
}
```

---

## Combining useReducer with useContext

This powerful combination allows you to create a global state management solution similar to Redux, perfect for medium-sized applications.

### Basic Pattern

```javascript
import { createContext, useContext, useReducer } from 'react';

// 1. Create Context
const StateContext = createContext();
const DispatchContext = createContext();

// 2. Create Provider Component
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 3. Create Custom Hooks
function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

// 4. Use in Components
function App() {
  return (
    <AppProvider>
      <Header />
      <Main />
      <Footer />
    </AppProvider>
  );
}

function Header() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header>
      <h1>{state.title}</h1>
      <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
        Toggle Theme
      </button>
    </header>
  );
}
```

### Complete Example: Theme and Auth System

```javascript
// contexts/AppContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  theme: 'light',
  user: null,
  isAuthenticated: false,
  notifications: [],
  loading: false
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    
    case 'LOGIN_START':
      return {
        ...state,
        loading: true
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notif) => notif.id !== action.payload
        )
      };
    
    default:
      return state;
  }
}

// Context
const StateContext = createContext();
const DispatchContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    // Lazy initialization - load from localStorage
    const savedTheme = localStorage.getItem('theme');
    return {
      ...initial,
      theme: savedTheme || initial.theme
    };
  });

  // Sync theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom Hooks
export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

// Helper hook that combines both
export function useApp() {
  return {
    state: useAppState(),
    dispatch: useAppDispatch()
  };
}

// Action Creators
export const actions = {
  setTheme: (theme) => ({ type: 'SET_THEME', payload: theme }),
  toggleTheme: () => ({ type: 'TOGGLE_THEME' }),
  loginStart: () => ({ type: 'LOGIN_START' }),
  loginSuccess: (user) => ({ type: 'LOGIN_SUCCESS', payload: user }),
  loginError: () => ({ type: 'LOGIN_ERROR' }),
  logout: () => ({ type: 'LOGOUT' }),
  addNotification: (message) => ({
    type: 'ADD_NOTIFICATION',
    payload: { id: Date.now(), message }
  }),
  removeNotification: (id) => ({ type: 'REMOVE_NOTIFICATION', payload: id })
};
```

```javascript
// App.js
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Header />
        <Dashboard />
        <Notifications />
      </div>
    </AppProvider>
  );
}

export default App;
```

```javascript
// components/Header.js
import { useAppState, useAppDispatch, actions } from '../contexts/AppContext';

function Header() {
  const { theme, user, isAuthenticated } = useAppState();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    dispatch(actions.loginStart());
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'demo', password: 'demo' })
      });
      const userData = await response.json();
      dispatch(actions.loginSuccess(userData));
      dispatch(actions.addNotification('Login successful!'));
    } catch (error) {
      dispatch(actions.loginError());
      dispatch(actions.addNotification('Login failed'));
    }
  };

  return (
    <header className={`header ${theme}`}>
      <h1>My App</h1>
      <button onClick={() => dispatch(actions.toggleTheme())}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user.name}!</span>
          <button onClick={() => dispatch(actions.logout())}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </header>
  );
}

export default Header;
```

```javascript
// components/Notifications.js
import { useEffect } from 'react';
import { useAppState, useAppDispatch, actions } from '../contexts/AppContext';

function Notifications() {
  const { notifications } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Auto-remove notifications after 3 seconds
    const timers = notifications.map((notif) =>
      setTimeout(() => {
        dispatch(actions.removeNotification(notif.id));
      }, 3000)
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, dispatch]);

  return (
    <div className="notifications">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification">
          {notif.message}
          <button onClick={() => dispatch(actions.removeNotification(notif.id))}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
```

### Multiple Contexts Pattern

For larger apps, split contexts by domain:

```javascript
// contexts/AuthContext.js
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// contexts/ThemeContext.js
export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, themeInitialState);
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

// App.js
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

## Complex State Logic Examples

### Example 1: Form with Validation

```javascript
import { useReducer } from 'react';

const initialState = {
  values: {
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: false,
  submitCount: 0
};

function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        }
      };
    
    case 'BLUR':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
        isValid: Object.keys(action.payload).length === 0
      };
    
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        submitCount: state.submitCount + 1
      };
    
    case 'SUBMIT_SUCCESS':
      return {
        ...initialState,
        submitCount: state.submitCount
      };
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        errors: action.payload
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

function validateForm(values) {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  
  if (values.age && (values.age < 18 || values.age > 120)) {
    errors.age = 'Age must be between 18 and 120';
  }
  
  return errors;
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: 'CHANGE',
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleBlur = (e) => {
    dispatch({
      type: 'BLUR',
      field: e.target.name
    });
    
    // Validate on blur
    const errors = validateForm(state.values);
    dispatch({ type: 'SET_ERRORS', payload: errors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(state.values);
    dispatch({ type: 'SET_ERRORS', payload: errors });
    
    if (Object.keys(errors).length === 0) {
      dispatch({ type: 'SUBMIT_START' });
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.values)
        });
        
        if (response.ok) {
          dispatch({ type: 'SUBMIT_SUCCESS' });
          alert('Registration successful!');
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: { submit: error.message }
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={state.values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {state.touched.email && state.errors.email && (
          <span className="error">{state.errors.email}</span>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={state.values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {state.touched.password && state.errors.password && (
          <span className="error">{state.errors.password}</span>
        )}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={state.values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {state.touched.confirmPassword && state.errors.confirmPassword && (
          <span className="error">{state.errors.confirmPassword}</span>
        )}
      </div>

      <div>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={state.values.age}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {state.touched.age && state.errors.age && (
          <span className="error">{state.errors.age}</span>
        )}
      </div>

      <button type="submit" disabled={!state.isValid || state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
      
      <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>

      {state.errors.submit && (
        <div className="error">{state.errors.submit}</div>
      )}
    </form>
  );
}
```

### Example 2: Data Fetching with Pagination

```javascript
import { useReducer, useEffect } from 'react';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  hasMore: true,
  filters: {
    search: '',
    category: 'all',
    sortBy: 'date'
  }
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        total: action.payload.total,
        hasMore: action.payload.hasMore
      };
    
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload
      };
    
    case 'NEXT_PAGE':
      return {
        ...state,
        page: state.page + 1
      };
    
    case 'PREV_PAGE':
      return {
        ...state,
        page: Math.max(1, state.page - 1)
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        page: 1, // Reset to first page when filtering
        filters: {
          ...state.filters,
          [action.field]: action.value
        }
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        page: 1,
        filters: initialState.filters
      };
    
    default:
      return state;
  }
}

function DataTable() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: 'FETCH_START' });
      
      try {
        const queryParams = new URLSearchParams({
          page: state.page,
          pageSize: state.pageSize,
          search: state.filters.search,
          category: state.filters.category,
          sortBy: state.filters.sortBy
        });
        
        const response = await fetch(`/api/data?${queryParams}`);
        const result = await response.json();
        
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            data: result.items,
            total: result.total,
            hasMore: result.items.length === state.pageSize
          }
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: error.message
        });
      }
    }
    
    fetchData();
  }, [state.page, state.pageSize, state.filters]);

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={state.filters.search}
          onChange={(e) =>
            dispatch({
              type: 'SET_FILTER',
              field: 'search',
              value: e.target.value
            })
          }
        />
        
        <select
          value={state.filters.category}
          onChange={(e) =>
            dispatch({
              type: 'SET_FILTER',
              field: 'category',
              value: e.target.value
            })
          }
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="business">Business</option>
          <option value="science">Science</option>
        </select>
        
        <select
          value={state.filters.sortBy}
          onChange={(e) =>
            dispatch({
              type: 'SET_FILTER',
              field: 'sortBy',
              value: e.target.value
            })
          }
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="popularity">Popularity</option>
        </select>
        
        <button onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
          Reset Filters
        </button>
      </div>

      {state.loading && <div>Loading...</div>}
      {state.error && <div className="error">{state.error}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {state.data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => dispatch({ type: 'PREV_PAGE' })}
          disabled={state.page === 1 || state.loading}
        >
          Previous
        </button>
        
        <span>
          Page {state.page} of {Math.ceil(state.total / state.pageSize)}
        </span>
        
        <button
          onClick={() => dispatch({ type: 'NEXT_PAGE' })}
          disabled={!state.hasMore || state.loading}
        >
          Next
        </button>
      </div>

      <div>
        Showing {state.data.length} of {state.total} items
      </div>
    </div>
  );
}
```

### Example 3: Shopping Cart with Inventory

```javascript
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  discount: 0,
  couponCode: '',
  shipping: 0,
  tax: 0,
  taxRate: 0.08,
  inventory: {
    // product_id: available_quantity
    1: 10,
    2: 5,
    3: 20
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      const availableQuantity = state.inventory[product.id] || 0;
      
      if (availableQuantity === 0) {
        return state; // Out of stock
      }
      
      let newItems;
      let newInventory = { ...state.inventory };
      
      if (existingItem) {
        if (existingItem.quantity >= availableQuantity) {
          return state; // Can't add more
        }
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }];
      }
      
      newInventory[product.id] = availableQuantity - 1;
      
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      
      return {
        ...state,
        items: newItems,
        inventory: newInventory,
        total: newTotal,
        itemCount: newItemCount,
        tax: newTotal * state.taxRate
      };
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (!item) return state;
      
      const newItems = state.items.filter(item => item.id !== productId);
      const newInventory = {
        ...state.inventory,
        [productId]: state.inventory[productId] + item.quantity
      };
      
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      
      return {
        ...state,
        items: newItems,
        inventory: newInventory,
        total: newTotal,
        itemCount: newItemCount,
        tax: newTotal * state.taxRate
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (!item) return state;
      
      const availableQuantity = state.inventory[productId] + item.quantity;
      const newQuantity = Math.max(0, Math.min(quantity, availableQuantity));
      
      if (newQuantity === 0) {
        return cartReducer(state, {
          type: 'REMOVE_ITEM',
          payload: { productId }
        });
      }
      
      const newItems = state.items.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      const newInventory = {
        ...state.inventory,
        [productId]: availableQuantity - newQuantity
      };
      
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      
      return {
        ...state,
        items: newItems,
        inventory: newInventory,
        total: newTotal,
        itemCount: newItemCount,
        tax: newTotal * state.taxRate
      };
    }
    
    case 'APPLY_COUPON': {
      const { code } = action.payload;
      let discount = 0;
      
      // Simple coupon logic
      if (code === 'SAVE10') discount = state.total * 0.1;
      if (code === 'SAVE20') discount = state.total * 0.2;
      if (code === 'FLAT50') discount = 50;
      
      return {
        ...state,
        discount,
        couponCode: code
      };
    }
    
    case 'CLEAR_CART':
      // Restore inventory
      const restoredInventory = { ...state.inventory };
      state.items.forEach(item => {
        restoredInventory[item.id] += item.quantity;
      });
      
      return {
        ...initialState,
        inventory: restoredInventory
      };
    
    case 'SET_SHIPPING':
      return {
        ...state,
        shipping: action.payload
      };
    
    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const grandTotal = state.total - state.discount + state.shipping + state.tax;

  return (
    <div className="cart">
      <h2>Shopping Cart ({state.itemCount} items)</h2>
      
      {state.items.map(item => (
        <div key={item.id} className="cart-item">
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          
          <div>
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: {
                    productId: item.id,
                    quantity: item.quantity - 1
                  }
                })
              }
            >
              -
            </button>
            
            <span>{item.quantity}</span>
            
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: {
                    productId: item.id,
                    quantity: item.quantity + 1
                  }
                })
              }
              disabled={state.inventory[item.id] === 0}
            >
              +
            </button>
          </div>
          
          <p>Available: {state.inventory[item.id]}</p>
          <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
          
          <button
            onClick={() =>
              dispatch({
                type: 'REMOVE_ITEM',
                payload: { productId: item.id }
              })
            }
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <p>Subtotal: ${state.total.toFixed(2)}</p>
        <p>Discount: -${state.discount.toFixed(2)}</p>
        <p>Shipping: ${state.shipping.toFixed(2)}</p>
        <p>Tax: ${state.tax.toFixed(2)}</p>
        <h3>Total: ${grandTotal.toFixed(2)}</h3>
        
        <input
          type="text"
          placeholder="Coupon code"
          value={state.couponCode}
          onChange={(e) =>
            dispatch({
              type: 'APPLY_COUPON',
              payload: { code: e.target.value }
            })
          }
        />
        
        <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Keep Reducers Pure

```javascript
// ❌ BAD - Side effects in reducer
function badReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // Don't do API calls in reducer!
      fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      return { ...state, todos: [...state.todos, action.payload] };
  }
}

// ✅ GOOD - Pure reducer
function goodReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
  }
}

// Handle side effects in the component
function TodoApp() {
  const [state, dispatch] = useReducer(goodReducer, initialState);

  const addTodo = async (todo) => {
    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo)
    });
    dispatch({ type: 'ADD_TODO', payload: todo });
  };
}
```

### 2. Use Action Type Constants

```javascript
// ✅ GOOD - Constants prevent typos
const ACTION_TYPES = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_TODO:
      // ...
  }
}

dispatch({ type: ACTION_TYPES.ADD_TODO, payload: todo });
```

### 3. Organize Complex Reducers

```javascript
// Split large reducers into smaller functions
function todosReducer(todos, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...todos, action.payload];
    case 'TOGGLE_TODO':
      return todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return todos;
  }
}

function filtersReducer(filters, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...filters, [action.field]: action.value };
    default:
      return filters;
  }
}

function mainReducer(state, action) {
  return {
    todos: todosReducer(state.todos, action),
    filters: filtersReducer(state.filters, action)
  };
}
```

### 4. Use Lazy Initialization

```javascript
// ✅ Expensive initialization only runs once
function init(initialValue) {
  return {
    data: computeExpensiveValue(initialValue),
    loading: false
  };
}

function Component() {
  const [state, dispatch] = useReducer(reducer, initialValue, init);
}
```

### 5. Type Safety with TypeScript

```typescript
// Define state type
interface State {
  count: number;
  loading: boolean;
  error: string | null;
}

// Define action types
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// Typed reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
```

### 6. Memoize Dispatch

```javascript
// dispatch is stable and doesn't need to be in dependency arrays
useEffect(() => {
  dispatch({ type: 'FETCH_DATA' });
}, []); // No need to include dispatch
```

---

## Common Patterns

### Pattern 1: Async Actions with useReducer

```javascript
function asyncReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function useAsyncData(url) {
  const [state, dispatch] = useReducer(asyncReducer, {
    data: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (error) {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
```

### Pattern 2: Undo/Redo

```javascript
function undoableReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO':
      if (past.length === 0) return state;
      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [present, ...future]
      };

    case 'REDO':
      if (future.length === 0) return state;
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1)
      };

    case 'SET':
      return {
        past: [...past, present],
        present: action.payload,
        future: []
      };

    default:
      return state;
  }
}

function UndoableEditor() {
  const [state, dispatch] = useReducer(undoableReducer, {
    past: [],
    present: '',
    future: []
  });

  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={state.past.length === 0}
      >
        Undo
      </button>
      <button
        onClick={() => dispatch({ type: 'REDO' })}
        disabled={state.future.length === 0}
      >
        Redo
      </button>
      <input
        value={state.present}
        onChange={(e) =>
          dispatch({ type: 'SET', payload: e.target.value })
        }
      />
    </div>
  );
}
```

### Pattern 3: Middleware Pattern

```javascript
function loggerMiddleware(reducer) {
  return (state, action) => {
    console.log('Previous State:', state);
    console.log('Action:', action);
    const newState = reducer(state, action);
    console.log('Next State:', newState);
    return newState;
  };
}

function useReducerWithMiddleware(reducer, initialState, middleware) {
  const reducerWithMiddleware = middleware(reducer);
  return useReducer(reducerWithMiddleware, initialState);
}

// Usage
const [state, dispatch] = useReducerWithMiddleware(
  myReducer,
  initialState,
  loggerMiddleware
);
```

---

## Summary

### Key Takeaways

1. **useReducer** is ideal for complex state logic and interdependent state updates
2. **Reducers** must be pure functions that return new state without mutations
3. **Actions** describe what happened and carry data via payload
4. **Action creators** encapsulate action creation logic
5. **useReducer + useContext** provides powerful global state management
6. Choose **useState** for simple state, **useReducer** for complex state

### When to Use What

| Scenario | Use useState | Use useReducer |
|----------|-------------|----------------|
| Simple values | ✅ | ❌ |
| Independent state | ✅ | ❌ |
| Complex objects | ❌ | ✅ |
| Interdependent updates | ❌ | ✅ |
| State transitions | ❌ | ✅ |
| Global state (with Context) | ❌ | ✅ |

### Practice Exercises

1. Build a multi-step form with validation using useReducer
2. Create a shopping cart with inventory management
3. Implement a data table with sorting, filtering, and pagination
4. Build a simple game (tic-tac-toe) with undo/redo
5. Create a theme + auth system using useReducer + useContext

---

Happy coding! 🚀
