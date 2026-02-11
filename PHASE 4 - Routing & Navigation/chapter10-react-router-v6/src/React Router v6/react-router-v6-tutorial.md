# React Router v6 - Complete Tutorial

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [BrowserRouter Setup](#browserrouter-setup)
4. [Routes and Route](#routes-and-route)
5. [Link and NavLink](#link-and-navlink)
6. [useNavigate Hook](#usenavigate-hook)
7. [useParams for Dynamic Routes](#useparams-for-dynamic-routes)
8. [useLocation and useSearchParams](#uselocation-and-usesearchparams)
9. [Nested Routes](#nested-routes)
10. [Protected Routes](#protected-routes)
11. [Lazy Loading Routes](#lazy-loading-routes)
12. [404 Pages](#404-pages)
13. [Programmatic Navigation](#programmatic-navigation)
14. [Complete Example](#complete-example)

---

## Introduction

React Router v6 is the latest version of the standard routing library for React applications. It provides a declarative way to handle navigation and routing in single-page applications (SPAs).

**Key Features:**
- Simplified API compared to v5
- Improved bundle size
- Better TypeScript support
- Relative routing and links
- Enhanced nested routing

---

## Installation

Install React Router v6 in your React project:

```bash
npm install react-router-dom
```

Or with yarn:

```bash
yarn add react-router-dom
```

---

## BrowserRouter Setup

The `BrowserRouter` component uses the HTML5 history API to keep your UI in sync with the URL.

### Basic Setup

**src/main.jsx** (or **index.js**):

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**Key Points:**
- Wrap your entire app with `BrowserRouter`
- Only use one `BrowserRouter` per application
- Place it at the root level of your component tree

**Alternative Routers:**
- `HashRouter` - Uses URL hash for routing (for legacy browsers)
- `MemoryRouter` - Keeps routing in memory (useful for testing)

---

## Routes and Route

The `Routes` component replaces the `Switch` component from v5. It renders the first `Route` that matches the current location.

### Basic Routes

**src/App.jsx**:

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
```

### Key Changes from v5

**v5 Syntax:**
```jsx
<Route path="/about" component={About} />
```

**v6 Syntax:**
```jsx
<Route path="/about" element={<About />} />
```

**Benefits:**
- Can pass props directly to components
- More flexible element rendering
- Better TypeScript support

---

## Link and NavLink

### Link Component

The `Link` component creates accessible navigation links without full page reloads.

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

### NavLink Component

`NavLink` is a special version of `Link` that knows when it's active, making it perfect for navigation menus.

```jsx
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>
      
      <NavLink 
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? '#fff' : '#ccc',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        About
      </NavLink>
      
      <NavLink to="/contact">
        {({ isActive }) => (
          <span className={isActive ? 'active-link' : ''}>
            Contact
          </span>
        )}
      </NavLink>
    </nav>
  );
}
```

**Navigation.css**:
```css
.active {
  color: #4CAF50;
  font-weight: bold;
  border-bottom: 2px solid #4CAF50;
}
```

**Key Features:**
- `isActive` prop indicates if the link matches the current URL
- `isPending` prop indicates if navigation is pending (v6.4+)
- Supports className, style as functions or strings

---

## useNavigate Hook

The `useNavigate` hook provides programmatic navigation, replacing the `useHistory` hook from v5.

### Basic Usage

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic
    
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Advanced Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function ProductActions() {
  const navigate = useNavigate();

  const handleDelete = () => {
    // Delete product logic
    
    // Navigate back one page
    navigate(-1);
  };

  const handleCancel = () => {
    // Navigate forward one page
    navigate(1);
  };

  const handleSave = () => {
    // Navigate with state
    navigate('/products', { 
      state: { message: 'Product saved successfully' } 
    });
  };

  const handleReplace = () => {
    // Replace current entry in history stack
    navigate('/products', { replace: true });
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete & Go Back</button>
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleReplace}>Save & Replace</button>
    </div>
  );
}
```

**Options:**
- `navigate(delta)` - Go forward/backward in history (number)
- `navigate(to)` - Navigate to a path (string)
- `{ replace: true }` - Replace instead of push to history
- `{ state: {...} }` - Pass state to destination

---

## useParams for Dynamic Routes

The `useParams` hook retrieves URL parameters from dynamic route segments.

### Single Parameter

**Route Definition:**
```jsx
<Route path="/user/:userId" element={<UserProfile />} />
```

**Component Usage:**
```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
}
```

### Multiple Parameters

**Route Definition:**
```jsx
<Route path="/blog/:category/:postId" element={<BlogPost />} />
```

**Component Usage:**
```jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BlogPost() {
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch post based on category and postId
    fetch(`/api/posts/${category}/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [category, postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Category: {category}</p>
      <p>Post ID: {postId}</p>
      <div>{post.content}</div>
    </article>
  );
}
```

### Optional Parameters

```jsx
// Route with optional parameter
<Route path="/products/:id?" element={<Products />} />

function Products() {
  const { id } = useParams();

  return (
    <div>
      {id ? (
        <ProductDetail productId={id} />
      ) : (
        <ProductList />
      )}
    </div>
  );
}
```

---

## useLocation and useSearchParams

### useLocation Hook

Access the current location object containing pathname, search, hash, and state.

```jsx
import { useLocation } from 'react-router-dom';

function CurrentLocation() {
  const location = useLocation();

  return (
    <div>
      <h2>Current Location Info</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}
```

**Accessing Passed State:**
```jsx
import { useLocation, useNavigate } from 'react-router-dom';

function Products() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      {message && <div className="alert">{message}</div>}
      <h1>Products</h1>
    </div>
  );
}
```

### useSearchParams Hook

Manage URL query parameters similar to `useState`.

**Basic Usage:**
```jsx
import { useSearchParams } from 'react-router-dom';

function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory, sort });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ category, sort: newSort });
  };

  return (
    <div>
      <h2>Filters</h2>
      <p>Category: {category}</p>
      <p>Sort: {sort}</p>
      
      <select 
        value={category} 
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select 
        value={sort} 
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
```

**Advanced Usage:**
```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const filters = searchParams.getAll('filter'); // Get multiple values

  const handleSearch = (newQuery) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', newQuery);
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const toggleFilter = (filter) => {
    const params = new URLSearchParams(searchParams);
    
    if (filters.includes(filter)) {
      // Remove filter
      const newFilters = filters.filter(f => f !== filter);
      params.delete('filter');
      newFilters.forEach(f => params.append('filter', f));
    } else {
      // Add filter
      params.append('filter', filter);
    }
    
    setSearchParams(params);
  };

  return (
    <div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>Page: {page}</p>
      <p>Active Filters: {filters.join(', ')}</p>
      
      <button onClick={() => toggleFilter('sale')}>Sale Items</button>
      <button onClick={() => toggleFilter('new')}>New Arrivals</button>
      
      <button onClick={() => handlePageChange(page - 1)}>Previous</button>
      <button onClick={() => handlePageChange(page + 1)}>Next</button>
    </div>
  );
}
```

---

## Nested Routes

Nested routes allow you to create layouts with shared UI elements and nested views.

### Basic Nested Routes

**App.jsx**:
```jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import Analytics from './pages/dashboard/Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
```

### Layout Component with Outlet

The `Outlet` component renders the matching child route.

**components/Layout.jsx**:
```jsx
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="layout">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
}

export default Layout;
```

### Nested Dashboard Layout

**pages/Dashboard.jsx**:
```jsx
import { Outlet, NavLink } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard">Analytics</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </aside>
      
      <div className="dashboard-content">
        <Outlet /> {/* Nested routes render here */}
      </div>
    </div>
  );
}

export default Dashboard;
```

### Index Routes

Index routes render when the parent route matches but no child route matches.

```jsx
<Route path="dashboard" element={<Dashboard />}>
  <Route index element={<DashboardHome />} /> {/* Renders at /dashboard */}
  <Route path="stats" element={<Stats />} /> {/* Renders at /dashboard/stats */}
</Route>
```

### Relative Routing

In nested routes, paths can be relative to their parent route.

```jsx
function Dashboard() {
  return (
    <div>
      {/* Relative link - resolves to /dashboard/settings */}
      <Link to="settings">Settings</Link>
      
      {/* Absolute link */}
      <Link to="/dashboard/settings">Settings</Link>
      
      {/* Go up one level - resolves to / */}
      <Link to="..">Back to Home</Link>
    </div>
  );
}
```

---

## Protected Routes

Protected routes restrict access based on authentication or authorization status.

### Method 1: Wrapper Component

**components/ProtectedRoute.jsx**:
```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login, save attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
```

**Usage in App.jsx**:
```jsx
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### Method 2: Layout Route Pattern

**components/RequireAuth.jsx**:
```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
```

**Usage with Nested Routes**:
```jsx
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Role-based protected routes */}
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminPanel />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

### Auth Context Example

**contexts/AuthContext.jsx**:
```jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., check token)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**hooks/useAuth.js**:
```jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Login Component with Redirect

**pages/Login.jsx**:
```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

---

## Lazy Loading Routes

Lazy loading splits your code into smaller chunks, improving initial load time.

### Basic Lazy Loading

**App.jsx**:
```jsx
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Eagerly loaded components
import Layout from './components/Layout';
import Home from './pages/Home';

// Lazy loaded components
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        <Route
          path="about"
          element={
            <Suspense fallback={<div>Loading About...</div>}>
              <About />
            </Suspense>
          }
        />
        
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<div>Loading Dashboard...</div>}>
              <Dashboard />
            </Suspense>
          }
        />
        
        <Route
          path="profile"
          element={
            <Suspense fallback={<div>Loading Profile...</div>}>
              <Profile />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
```

### Centralized Loading Component

**components/LoadingFallback.jsx**:
```jsx
function LoadingFallback({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingFallback;
```

**App.jsx with Custom Fallback**:
```jsx
import { lazy, Suspense } from 'react';
import LoadingFallback from './components/LoadingFallback';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <Suspense fallback={<LoadingFallback message="Loading Dashboard..." />}>
            <Dashboard />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

### Reusable Lazy Route Wrapper

**components/LazyRoute.jsx**:
```jsx
import { Suspense } from 'react';
import LoadingFallback from './LoadingFallback';

function LazyRoute({ children, fallback }) {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </Suspense>
  );
}

export default LazyRoute;
```

**Usage**:
```jsx
import { lazy } from 'react';
import LazyRoute from './components/LazyRoute';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <LazyRoute>
            <Dashboard />
          </LazyRoute>
        }
      />
      
      <Route
        path="profile"
        element={
          <LazyRoute fallback={<div>Loading your profile...</div>}>
            <Profile />
          </LazyRoute>
        }
      />
    </Routes>
  );
}
```

### Preloading Routes

Preload routes on hover or user interaction for faster navigation.

```jsx
import { lazy } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));

// Preload function
const preloadDashboard = () => {
  import('./pages/Dashboard');
};

function Navigation() {
  return (
    <nav>
      <Link 
        to="/dashboard"
        onMouseEnter={preloadDashboard}
        onFocus={preloadDashboard}
      >
        Dashboard
      </Link>
    </nav>
  );
}
```

---

## 404 Pages

Handle routes that don't match any defined path with a 404 page.

### Basic 404 Route

**pages/NotFound.jsx**:
```jsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFound;
```

**App.jsx**:
```jsx
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Catch-all route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### 404 with Layout

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        
        {/* 404 with layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

### Enhanced 404 Page

**pages/NotFound.jsx**:
```jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log 404 errors for analytics
    console.log('404 Error:', location.pathname);
  }, [location]);

  return (
    <div className="not-found-container">
      <div className="error-code">404</div>
      <h1>Oops! Page Not Found</h1>
      <p>
        The page <code>{location.pathname}</code> does not exist.
      </p>
      
      <div className="actions">
        <Link to="/" className="btn-primary">
          Go to Homepage
        </Link>
        
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
      
      <div className="suggestions">
        <h3>You might be looking for:</h3>
        <ul>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default NotFound;
```

### Nested 404 Routes

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="stats" element={<Stats />} />
          
          {/* 404 for unknown dashboard routes */}
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
        
        {/* 404 for all other routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

---

## Programmatic Navigation

Navigate users programmatically based on events, conditions, or user actions.

### Using useNavigate Hook

**Basic Navigation**:
```jsx
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      const newProduct = await response.json();
      
      // Navigate to the new product page
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(/* form data */);
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Navigation with State

```jsx
function ProductList() {
  const navigate = useNavigate();

  const handleDelete = async (productId) => {
    await deleteProduct(productId);
    
    // Navigate with success message
    navigate('/products', { 
      state: { 
        message: 'Product deleted successfully',
        type: 'success'
      } 
    });
  };

  return (
    <div>
      {/* product list */}
    </div>
  );
}
```

### Replace vs Push

```jsx
function Wizard() {
  const navigate = useNavigate();

  const goToNextStep = () => {
    // Push new entry to history (default)
    navigate('/wizard/step2');
  };

  const goToResults = () => {
    // Replace current entry (user can't go back to wizard)
    navigate('/results', { replace: true });
  };

  return (
    <div>
      <button onClick={goToNextStep}>Next Step</button>
      <button onClick={goToResults}>View Results</button>
    </div>
  );
}
```

### Conditional Navigation

```jsx
function ConditionalRedirect() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.emailVerified) {
      navigate('/verify-email');
    } else if (!user.onboardingComplete) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  return <div>Welcome!</div>;
}
```

### Navigate Component (Declarative)

```jsx
import { Navigate } from 'react-router-dom';

function OldProductPage() {
  // Redirect old route to new route
  return <Navigate to="/new-products" replace />;
}

function Dashboard() {
  const { user } = useAuth();

  // Conditional redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <div>Dashboard Content</div>;
}
```

### Timed Navigation

```jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Success!</h1>
      <p>Redirecting to dashboard in {countdown} seconds...</p>
      <button onClick={() => navigate('/dashboard')}>
        Go Now
      </button>
    </div>
  );
}
```

### Form Submission with Navigation

```jsx
function ContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Navigate with success state
        navigate('/thank-you', {
          state: {
            name: formData.name,
            submittedAt: new Date().toISOString()
          }
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      // Stay on page, show error
      alert('Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Complete Example

Here's a complete application demonstrating all concepts together.

### Project Structure

```
src/
├── components/
│   ├── Layout.jsx
│   ├── Navigation.jsx
│   ├── ProtectedRoute.jsx
│   └── LoadingFallback.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── NotFound.jsx
│   └── dashboard/
│       ├── Profile.jsx
│       ├── Settings.jsx
│       └── Analytics.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── App.jsx
└── main.jsx
```

### App.jsx (Main Router Configuration)

```jsx
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingFallback from './components/LoadingFallback';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Lazy loaded components
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        
        <Route
          path="about"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <About />
            </Suspense>
          }
        />
        
        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

### components/Layout.jsx

```jsx
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function Layout() {
  return (
    <div className="app-container">
      <Navigation />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 React Router Tutorial. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
```

### components/Navigation.jsx

```jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <NavLink to="/">MyApp</NavLink>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        
        {user ? (
          <>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
```

### pages/Home.jsx

```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to React Router v6 Tutorial</h1>
      
      {user ? (
        <div>
          <p>Hello, {user.name}!</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div>
          <p>Please log in to access the dashboard.</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      )}
      
      <div className="features">
        <h2>Features Covered:</h2>
        <ul>
          <li>BrowserRouter Setup</li>
          <li>Routes and Route Components</li>
          <li>Link and NavLink</li>
          <li>useNavigate Hook</li>
          <li>useParams for Dynamic Routes</li>
          <li>useLocation and useSearchParams</li>
          <li>Nested Routes</li>
          <li>Protected Routes</li>
          <li>Lazy Loading</li>
          <li>404 Pages</li>
          <li>Programmatic Navigation</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
```

### pages/Dashboard.jsx

```jsx
import { Outlet, NavLink } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2>Dashboard</h2>
        <nav>
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Analytics
          </NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </aside>
      
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
```

### main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## Best Practices

1. **Always wrap your app with BrowserRouter** at the root level
2. **Use nested routes** for shared layouts and hierarchical navigation
3. **Implement protected routes** for authenticated-only content
4. **Lazy load routes** to improve initial bundle size
5. **Always include a 404 route** as the last route in your configuration
6. **Use relative paths** in nested routes for better maintainability
7. **Leverage useSearchParams** for filter and pagination state
8. **Pass navigation state** when redirecting to preserve context
9. **Use replace option** when you don't want users to navigate back
10. **Handle loading states** properly with Suspense for lazy loaded routes

---

## Common Patterns

### Breadcrumbs

```jsx
import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return isLast ? (
          <span key={name}> / {name}</span>
        ) : (
          <span key={name}>
            {' / '}
            <Link to={routeTo}>{name}</Link>
          </span>
        );
      })}
    </nav>
  );
}
```

### Scroll to Top on Route Change

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Usage in App.jsx
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* routes */}
      </Routes>
    </>
  );
}
```

### Route-based Title Updates

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': 'Home',
  '/about': 'About Us',
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'Profile'
};

function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Page Not Found';
    document.title = `${title} | MyApp`;
  }, [location]);
}

// Usage in component
function App() {
  usePageTitle();
  
  return (
    <Routes>
      {/* routes */}
    </Routes>
  );
}
```

---

## Conclusion

React Router v6 provides a powerful, declarative way to handle routing in React applications. The key improvements over v5 include:

- Simpler, more intuitive API
- Better support for nested routes
- Improved bundle size with lazy loading
- Enhanced relative routing
- More flexible element rendering

By mastering these concepts, you can build complex, performant single-page applications with sophisticated navigation patterns.

## Additional Resources

- [Official React Router Documentation](https://reactrouter.com)
- [React Router GitHub Repository](https://github.com/remix-run/react-router)
- [Remix Framework](https://remix.run) (built on React Router)
