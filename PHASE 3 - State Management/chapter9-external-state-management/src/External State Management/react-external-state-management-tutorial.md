# Day 20-21: External State Management in React

## Table of Contents
1. [Why External State Managers?](#why-external-state-managers)
2. [Zustand Basics](#zustand-basics)
3. [Redux Toolkit Essentials](#redux-toolkit-essentials)
4. [When to Use What](#when-to-use-what)
5. [Practice Exercises](#practice-exercises)

---

## Why External State Managers?

### Problems with Built-in State Management

While React's built-in state management (useState, useReducer, Context API) works well for small to medium applications, you may encounter challenges as your app grows:

#### 1. **Prop Drilling**
```jsx
// Passing props through multiple levels
function App() {
  const [user, setUser] = useState(null);
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finally using it here!
  return <div>{user?.name}</div>;
}
```

#### 2. **Context Performance Issues**
```jsx
// Every component re-renders when any value changes
const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [cart, setCart] = useState([]);
  
  // All consumers re-render when ANY of these change
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, cart, setCart }}>
      <Components />
    </AppContext.Provider>
  );
}
```

#### 3. **Complex State Logic**
```jsx
// Scattered state logic across components
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // This logic is duplicated in multiple components
}
```

### Benefits of External State Managers

- ✅ **No Prop Drilling**: Access state anywhere in your component tree
- ✅ **Better Performance**: Fine-grained updates, only affected components re-render
- ✅ **Centralized Logic**: All state logic in one place
- ✅ **DevTools**: Time-travel debugging and state inspection
- ✅ **Middleware**: Add logging, persistence, and more
- ✅ **Predictable**: Clear patterns for updating state

---

## Zustand Basics

### What is Zustand?

Zustand (German for "state") is a small, fast, and scalable state management solution. It's beginner-friendly and requires minimal boilerplate.

### Installation

```bash
npm install zustand
# or
yarn add zustand
```

### Creating Your First Store

```jsx
// stores/useCounterStore.js
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  // State
  count: 0,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (newCount) => set({ count: newCount }),
}));

export default useCounterStore;
```

### Using the Store in Components

```jsx
// components/Counter.jsx
import useCounterStore from '../stores/useCounterStore';

function Counter() {
  // Subscribe to the entire store
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;
```

### Selecting Specific State (Performance Optimization)

```jsx
// Only subscribe to count, not the entire store
function CountDisplay() {
  const count = useCounterStore((state) => state.count);
  
  return <h2>Count: {count}</h2>;
}

// Only get actions, no re-renders when count changes
function CounterButtons() {
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  
  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Real-World Example: Todo Store

```jsx
// stores/useTodoStore.js
import { create } from 'zustand';

const useTodoStore = create((set) => ({
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  
  // Add todo
  addTodo: (text) => set((state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      }
    ]
  })),
  
  // Toggle todo
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  // Delete todo
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id)
  })),
  
  // Edit todo
  editTodo: (id, newText) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    )
  })),
  
  // Set filter
  setFilter: (filter) => set({ filter }),
  
  // Clear completed
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter((todo) => !todo.completed)
  })),
  
  // Computed values (selectors)
  getFilteredTodos: () => {
    const { todos, filter } = useTodoStore.getState();
    
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },
}));

export default useTodoStore;
```

### Using the Todo Store

```jsx
// components/TodoApp.jsx
import { useState } from 'react';
import useTodoStore from '../stores/useTodoStore';

function TodoApp() {
  const [input, setInput] = useState('');
  const { addTodo, toggleTodo, deleteTodo, filter, setFilter } = useTodoStore();
  
  // Get filtered todos
  const todos = useTodoStore((state) => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter((todo) => !todo.completed);
      case 'completed':
        return state.todos.filter((todo) => todo.completed);
      default:
        return state.todos;
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };
  
  return (
    <div className="todo-app">
      <h1>My Todos</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>
      
      <div className="filters">
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>
          All
        </button>
        <button onClick={() => setFilter('active')} disabled={filter === 'active'}>
          Active
        </button>
        <button onClick={() => setFilter('completed')} disabled={filter === 'completed'}>
          Completed
        </button>
      </div>
      
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

### Async Actions in Zustand

```jsx
// stores/useUserStore.js
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  
  // Async action
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  login: async (credentials) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  logout: () => set({ user: null, error: null }),
}));

export default useUserStore;
```

### Zustand Middleware: Persist

```jsx
// stores/useSettingsStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      notifications: true,
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({ 
        notifications: !state.notifications 
      })),
    }),
    {
      name: 'app-settings', // localStorage key
    }
  )
);

export default useSettingsStore;
```

### Zustand Middleware: DevTools

```jsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: 'CounterStore' } // Name in DevTools
  )
);
```

### Combining Middleware

```jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        // your store
      }),
      { name: 'storage-key' }
    ),
    { name: 'DevTools Name' }
  )
);
```

---

## Redux Toolkit Essentials

### What is Redux Toolkit?

Redux Toolkit (RTK) is the official, opinionated way to write Redux. It includes utilities to simplify common Redux use cases and reduce boilerplate.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
# or
yarn add @reduxjs/toolkit react-redux
```

### Core Concepts

1. **Store**: Holds the entire state of your application
2. **Slice**: A collection of Redux reducer logic and actions for a single feature
3. **Actions**: Objects that describe what happened
4. **Reducers**: Functions that specify how state changes
5. **Dispatch**: Method to send actions to the store

### Creating Your First Slice

```jsx
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit uses Immer, so you can "mutate" state
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
```

### Configuring the Store

```jsx
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

### Providing the Store

```jsx
// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### Using Redux in Components

```jsx
// components/Counter.jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, reset } from '../features/counter/counterSlice';

function Counter() {
  // Select state
  const count = useSelector((state) => state.counter.value);
  
  // Get dispatch function
  const dispatch = useDispatch();
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

export default Counter;
```

### Real-World Example: Todos Slice

```jsx
// features/todos/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    },
    
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    deleteTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.items.find((todo) => todo.id === id);
      if (todo) {
        todo.text = text;
      }
    },
    
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    
    clearCompleted: (state) => {
      state.items = state.items.filter((todo) => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, setFilter, clearCompleted } = todosSlice.actions;

// Selectors
export const selectAllTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;

export const selectFilteredTodos = (state) => {
  const filter = selectFilter(state);
  const todos = selectAllTodos(state);
  
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export default todosSlice.reducer;
```

### Async Actions with createAsyncThunk

```jsx
// features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'users/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;
```

### Using Async Thunks in Components

```jsx
// components/UserProfile.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../features/users/usersSlice';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default UserProfile;
```

### Redux DevTools

Redux Toolkit automatically configures Redux DevTools. No additional setup needed!

**Features:**
- Time-travel debugging
- Action history
- State inspection
- Action replay

**Browser Extension:**
- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### RTK Query (Bonus: Data Fetching)

```jsx
// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice;
```

### Using RTK Query

```jsx
// components/PostsList.jsx
import { useGetPostsQuery, useDeletePostMutation } from '../features/api/apiSlice';

function PostsList() {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## When to Use What

### Decision Tree

```
Is your state local to a component?
├─ Yes → useState or useReducer
└─ No → Is it shared between a few closely related components?
    ├─ Yes → Lift state up or use Context
    └─ No → Do you need global state?
        ├─ Simple global state → Zustand
        ├─ Complex state with lots of async logic → Redux Toolkit
        └─ Heavy data fetching → RTK Query
```

### Context API

**Use When:**
- Theming (dark/light mode)
- Current user/authentication
- Language/locale
- Small to medium apps
- State doesn't change frequently

**Avoid When:**
- State changes frequently (performance issues)
- Complex state logic
- Need for DevTools
- Multiple unrelated states

**Example:**
```jsx
// Good use of Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

### Zustand

**Use When:**
- You want simplicity and minimal boilerplate
- Small to medium apps
- You're new to state management
- You need fine-grained reactivity
- You want easy persistence
- Quick prototyping

**Pros:**
- ✅ Minimal boilerplate
- ✅ Easy to learn
- ✅ Good performance
- ✅ No Provider needed
- ✅ Built-in middleware
- ✅ TypeScript support

**Cons:**
- ❌ Smaller ecosystem
- ❌ Less mature DevTools
- ❌ No built-in async patterns

**Example:**
```jsx
// Perfect for Zustand
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
}));
```

### Redux Toolkit

**Use When:**
- Large, complex applications
- Team prefers established patterns
- Need powerful DevTools
- Complex async logic
- Time-travel debugging is important
- Strict state management patterns needed

**Pros:**
- ✅ Mature ecosystem
- ✅ Excellent DevTools
- ✅ Predictable patterns
- ✅ Great for large teams
- ✅ RTK Query for data fetching
- ✅ Wide community support

**Cons:**
- ❌ More boilerplate than Zustand
- ❌ Steeper learning curve
- ❌ Requires Provider wrapper

**Example:**
```jsx
// Good for Redux
// Complex state with async logic, multiple features
const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

### Comparison Table

| Feature | Context | Zustand | Redux Toolkit |
|---------|---------|---------|---------------|
| Learning Curve | Easy | Easy | Moderate |
| Boilerplate | Low | Very Low | Moderate |
| Performance | Poor (frequent updates) | Excellent | Excellent |
| DevTools | No | Yes | Excellent |
| Async Logic | Manual | Manual | createAsyncThunk |
| Persistence | Manual | Built-in | Manual |
| TypeScript | Good | Excellent | Excellent |
| Bundle Size | 0kb (built-in) | ~1kb | ~15kb |
| Best For | Theming, Auth | Small-Medium Apps | Large Apps |

### Migration Path

**Starting Out:**
1. Start with useState and useReducer
2. Use Context for global state (theme, auth)
3. When you hit Context performance issues → Zustand
4. When you need complex async logic → Redux Toolkit

**Real Example:**

```jsx
// Phase 1: Context (Simple app)
const AppContext = createContext();

// Phase 2: Zustand (Growing app)
const useStore = create((set) => ({
  user: null,
  cart: [],
  // ...
}));

// Phase 3: Redux Toolkit (Large app)
const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    cart: cartSlice,
    orders: ordersSlice,
  },
});
```

---

## Practice Exercises

### Exercise 1: Zustand Shopping Cart

Create a shopping cart with Zustand that includes:

```jsx
// Requirements:
// 1. Add items to cart
// 2. Remove items from cart
// 3. Update quantity
// 4. Calculate total price
// 5. Clear cart
// 6. Persist cart to localStorage

// stores/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        // Your code here
      },
      
      removeItem: (productId) => {
        // Your code here
      },
      
      updateQuantity: (productId, quantity) => {
        // Your code here
      },
      
      clearCart: () => {
        // Your code here
      },
      
      getTotal: () => {
        // Your code here
      },
    }),
    { name: 'shopping-cart' }
  )
);

export default useCartStore;
```

**Solution:**

```jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId),
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    { name: 'shopping-cart' }
  )
);

export default useCartStore;
```

### Exercise 2: Redux Toolkit Blog

Create a blog application with Redux Toolkit:

```jsx
// Requirements:
// 1. Fetch posts from API
// 2. Create new post
// 3. Edit post
// 4. Delete post
// 5. Like/unlike posts
// 6. Filter posts by category

// features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    // Your code here
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filter: 'all',
  },
  reducers: {
    // Your reducers here
  },
  extraReducers: (builder) => {
    // Your async reducers here
  },
});

export default postsSlice.reducer;
```

**Solution:**

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return response.json();
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (newPost) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    return response.json();
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE',
    });
    return postId;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filter: 'all',
  },
  reducers: {
    likePost: (state, action) => {
      const post = state.items.find((post) => post.id === action.payload);
      if (post) {
        post.likes = (post.likes || 0) + 1;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      });
  },
});

export const { likePost, setFilter } = postsSlice.actions;

// Selectors
export const selectAllPosts = (state) => state.posts.items;
export const selectPostById = (state, postId) =>
  state.posts.items.find((post) => post.id === postId);

export default postsSlice.reducer;
```

### Exercise 3: Comparison Challenge

Convert this Context-based counter to both Zustand and Redux Toolkit:

```jsx
// Context version
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  
  const increment = () => {
    setCount(c => c + 1);
    setHistory(h => [...h, 'increment']);
  };
  
  const decrement = () => {
    setCount(c => c - 1);
    setHistory(h => [...h, 'decrement']);
  };
  
  const reset = () => {
    setCount(0);
    setHistory([]);
  };
  
  return (
    <CounterContext.Provider value={{ count, history, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}
```

**Your Task:** Implement this in both Zustand and Redux Toolkit.

---

## Best Practices

### 1. **Keep State Normalized**

```jsx
// ❌ Bad: Nested, denormalized
const state = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'John' },
      comments: [
        { id: 1, text: 'Great!', user: { id: 2, name: 'Jane' } }
      ]
    }
  ]
};

// ✅ Good: Normalized
const state = {
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1, commentIds: [1] }
    },
    allIds: [1]
  },
  users: {
    byId: {
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' }
    },
    allIds: [1, 2]
  },
  comments: {
    byId: {
      1: { id: 1, text: 'Great!', userId: 2 }
    },
    allIds: [1]
  }
};
```

### 2. **Use Selectors**

```jsx
// ✅ Zustand
const useCartStore = create((set, get) => ({
  items: [],
  
  // Selector
  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

// ✅ Redux Toolkit
export const selectTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

### 3. **Organize by Feature**

```
src/
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── Login.jsx
│   ├── posts/
│   │   ├── postsSlice.js
│   │   ├── PostsList.jsx
│   │   └── PostDetail.jsx
│   └── users/
│       ├── usersSlice.js
│       └── UserProfile.jsx
└── app/
    └── store.js
```

### 4. **Handle Loading States**

```jsx
// ✅ Always handle loading, error, and success states
function Component() {
  const { data, loading, error } = useSelector(state => state.posts);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!data) return null;
  
  return <div>{/* render data */}</div>;
}
```

---

## Summary

### Key Takeaways

1. **Context API**: Built-in, good for simple global state like theme and auth
2. **Zustand**: Minimal boilerplate, perfect for small to medium apps
3. **Redux Toolkit**: Best for large apps with complex state logic
4. **Choose based on your needs**: Don't over-engineer for simple apps

### Learning Path

1. ✅ Master useState and useReducer
2. ✅ Understand Context and its limitations
3. ✅ Learn Zustand for simplicity
4. ✅ Learn Redux Toolkit for complex apps
5. ✅ Explore RTK Query for data fetching

### Next Steps

- Build a complete app using Zustand
- Build a complete app using Redux Toolkit
- Compare the developer experience
- Choose your preferred tool and master it

### Resources

**Zustand:**
- [Official Docs](https://github.com/pmndrs/zustand)
- [Zustand Tutorial](https://www.youtube.com/watch?v=_ngCLZ5Iz-0)

**Redux Toolkit:**
- [Official Docs](https://redux-toolkit.js.org/)
- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-redux)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

---

## Final Project: Task Management App

Build a complete task management application that includes:

**Features:**
- User authentication
- Create, read, update, delete tasks
- Filter tasks (all, active, completed)
- Search tasks
- Categories/tags
- Due dates
- Priority levels
- Persist data

**Choose your state manager:**
- Option A: Build with Zustand
- Option B: Build with Redux Toolkit
- Option C: Build with both and compare

This project will consolidate everything you've learned about external state management!

Happy coding! 🚀
