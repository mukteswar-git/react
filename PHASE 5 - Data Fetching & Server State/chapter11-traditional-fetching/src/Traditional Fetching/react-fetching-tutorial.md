# Day 25-26: Traditional Fetching in React

## Table of Contents
- [Introduction](#introduction)
- [Fetch in useEffect Patterns](#fetch-in-useeffect-patterns)
- [Axios Setup and Interceptors](#axios-setup-and-interceptors)
- [Loading, Error, Success States](#loading-error-success-states)
- [Abort Controllers](#abort-controllers)
- [Retry Logic](#retry-logic)
- [Race Conditions](#race-conditions)
- [Best Practices](#best-practices)
- [Complete Examples](#complete-examples)

---

## Introduction

Traditional data fetching in React involves managing asynchronous requests within components using hooks like `useEffect`. While modern solutions like React Query exist, understanding traditional patterns is crucial for:

- Maintaining legacy codebases
- Understanding the problems modern libraries solve
- Working in environments where external dependencies are limited
- Building custom solutions when needed

---

## Fetch in useEffect Patterns

### Basic Pattern

The fundamental pattern for fetching data in React:

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]); // Re-fetch when userId changes

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
```

### Async/Await Pattern

A cleaner approach using async/await:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.example.com/users/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ... render logic
}
```

### Custom Hook Pattern

Extract fetching logic into a reusable hook:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user?.name}</div>;
}
```

---

## Axios Setup and Interceptors

### Installation and Basic Setup

```bash
npm install axios
```

### Creating an Axios Instance

```jsx
// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
```

### Request Interceptors

Add authentication tokens, logging, or modify requests:

```jsx
// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to every request
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request
    console.log('Request:', config.method.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Response Interceptors

Handle responses globally, refresh tokens, or transform data:

```jsx
// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Transform response data
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('authToken', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Using Axios in Components

```jsx
import { useState, useEffect } from 'react';
import axiosInstance from './api/axiosInstance';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ... render logic
}
```

### Advanced Axios Configuration

```jsx
// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Validate status codes
  validateStatus: (status) => status >= 200 && status < 300,
  // Transform request data
  transformRequest: [(data, headers) => {
    // Modify data before sending
    return JSON.stringify(data);
  }],
  // Transform response data
  transformResponse: [(data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }],
});

export default axiosInstance;
```

---

## Loading, Error, Success States

### State Management Pattern

```jsx
function DataFetchingComponent() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {state.loading && <LoadingSpinner />}
      {state.error && <ErrorMessage message={state.error} onRetry={fetchData} />}
      {state.data && <DataDisplay data={state.data} />}
    </div>
  );
}
```

### Using useReducer for Complex State

```jsx
import { useReducer, useEffect } from 'react';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function useDataFetcher(url) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (isMounted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}

// Usage
function UserList() {
  const { data, loading, error } = useDataFetcher('https://api.example.com/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Loading States UI Components

```jsx
// LoadingSpinner.jsx
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}

// SkeletonLoader.jsx
function SkeletonLoader() {
  return (
    <div className="skeleton">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  );
}

// ErrorMessage.jsx
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <p className="error-message">⚠️ {message}</p>
      {onRetry && (
        <button onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
}
```

### Conditional Rendering Pattern

```jsx
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic...

  // Early returns for different states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }

  // Success state
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## Abort Controllers

### Why Use Abort Controllers?

Abort controllers prevent race conditions and memory leaks by canceling ongoing requests when:
- Component unmounts before request completes
- User navigates away
- New request is triggered before previous one finishes

### Basic Abort Controller with Fetch

```jsx
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Create abort controller
    const abortController = new AbortController();
    const { signal } = abortController;

    const searchData = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        
        const response = await fetch(
          `https://api.example.com/search?q=${query}`,
          { signal } // Pass signal to fetch
        );
        
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
          console.log('Request was cancelled');
        } else {
          console.error('Search error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    searchData();

    // Cleanup: abort request on unmount or when query changes
    return () => {
      abortController.abort();
    };
  }, [query]);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Abort Controller with Axios

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create cancel token
    const cancelTokenSource = axios.CancelToken.source();

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/users/${userId}`, {
          cancelToken: cancelTokenSource.token
        });
        
        setUser(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request cancelled:', err.message);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Cleanup
    return () => {
      cancelTokenSource.cancel('Component unmounted');
    };
  }, [userId]);

  // ... render logic
}
```

### Custom Hook with Abort Controller

```jsx
import { useState, useEffect, useRef } from 'react';

function useFetchWithAbort(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Abort previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          ...options,
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function ProductList({ category }) {
  const { data, loading, error } = useFetchWithAbort(
    `https://api.example.com/products?category=${category}`
  );

  // ... render logic
}
```

### Manual Abort Example

```jsx
function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const abortControllerRef = useRef(null);

  const uploadFile = async (file) => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        signal,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      console.log('Upload successful');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled');
      } else {
        console.error('Upload error:', error);
      }
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
      {uploading && (
        <button onClick={cancelUpload}>Cancel Upload</button>
      )}
    </div>
  );
}
```

---

## Retry Logic

### Basic Retry Implementation

```jsx
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed:`, error.message);
      
      // Don't retry on last attempt
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  throw lastError;
}

// Usage
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchWithRetry('https://api.example.com/data');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... render logic
}
```

### Exponential Backoff Strategy

```jsx
function exponentialBackoff(retryCount) {
  // Calculate delay: 1s, 2s, 4s, 8s, etc.
  const baseDelay = 1000;
  const maxDelay = 30000; // Cap at 30 seconds
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 1000;
  
  return delay + jitter;
}

async function fetchWithExponentialBackoff(url, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log(`Retry ${i + 1}/${maxRetries}:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = exponentialBackoff(i);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Conditional Retry Logic

```jsx
async function fetchWithConditionalRetry(url, options = {}) {
  const maxRetries = 3;
  const retryableStatuses = [408, 429, 500, 502, 503, 504];

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Retry on specific status codes
      if (retryableStatuses.includes(response.status)) {
        throw new Error(`Retryable error: ${response.status}`);
      }
      
      if (!response.ok) {
        // Don't retry on 4xx errors (except 408, 429)
        throw new Error(`Non-retryable error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Don't retry on network errors after max attempts
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Check if error is retryable
      if (error.message.includes('Non-retryable')) {
        throw error;
      }
      
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### Custom Hook with Retry

```jsx
import { useState, useEffect, useCallback } from 'react';

function useFetchWithRetry(url, maxRetries = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        setLoading(true);
        setError(null);
        setRetryCount(attempts);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setLoading(false);
        return; // Success, exit retry loop
      } catch (err) {
        attempts++;
        
        if (attempts >= maxRetries) {
          setError(err.message);
          setLoading(false);
          return;
        }
        
        // Wait before retry
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    }
  }, [url, maxRetries]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, retryCount, refetch: fetchData };
}

// Usage
function ProductList() {
  const { data, loading, error, retryCount, refetch } = useFetchWithRetry(
    'https://api.example.com/products',
    3
  );

  if (loading) {
    return <div>Loading... {retryCount > 0 && `(Retry ${retryCount})`}</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <ul>
      {data?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Axios Retry with Interceptor

```jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
});

// Add retry interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Initialize retry count
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    // Check if we should retry
    const shouldRetry = 
      config.__retryCount < 3 &&
      (!error.response || [500, 502, 503, 504].includes(error.response.status));
    
    if (shouldRetry) {
      config.__retryCount++;
      
      // Calculate delay
      const delay = Math.pow(2, config.__retryCount) * 1000;
      
      console.log(`Retrying request (${config.__retryCount}/3) after ${delay}ms`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry request
      return axiosInstance(config);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## Race Conditions

### The Problem

Race conditions occur when multiple asynchronous operations are triggered and the order of completion affects the final state:

```jsx
// PROBLEMATIC CODE
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If userId changes quickly, old requests might complete after new ones
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data)); // Wrong user might be set!
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

### Solution 1: Cleanup Flag

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchUser = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error:', error);
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup function
    return () => {
      isMounted = false; // Component unmounted, ignore responses
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Solution 2: Abort Controller

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchUser = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/users/${userId}`, { signal });
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error:', error);
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      abortController.abort(); // Cancel ongoing request
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Solution 3: Request ID Tracking

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    const search = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        
        // Only update if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setResults(data);
          setLoading(false);
        }
      } catch (error) {
        if (currentRequestId === requestIdRef.current) {
          console.error('Search error:', error);
          setLoading(false);
        }
      }
    };

    if (query) {
      search();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div>
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Solution 4: Debouncing with Race Protection

```jsx
import { useState, useEffect, useRef } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const search = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(
          `/api/search?q=${debouncedQuery}`,
          { signal }
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    search();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Complex Race Condition Example

```jsx
function UserDashboard({ userId }) {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // Fetch user data and posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`/api/users/${userId}`, { signal }),
          fetch(`/api/users/${userId}/posts`, { signal })
        ]);

        const user = await userResponse.json();
        const posts = await postsResponse.json();

        // Only update if still mounted and not aborted
        if (isMounted) {
          setUserData(user);
          setUserPosts(posts);
          setLoading(false);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{userData?.name}</h1>
      <div>
        <h2>Posts</h2>
        {userPosts.map(post => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Always Handle Cleanup

```jsx
useEffect(() => {
  let isMounted = true;
  
  // Fetch logic
  
  return () => {
    isMounted = false;
  };
}, []);
```

### 2. Separate Concerns

```jsx
// DON'T: Mix data fetching with component logic
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Component logic mixed with fetching...
}

// DO: Extract into custom hooks
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch logic
  }, [userId]);
  
  return { user, loading, error };
}

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  // Clean component logic
}
```

### 3. Handle All States

```jsx
function DataComponent() {
  // Always manage: data, loading, error
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle all three states in UI
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  return <SuccessState data={data} />;
}
```

### 4. Use TypeScript for Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
```

### 5. Centralize API Configuration

```jsx
// api/config.js
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_TIMEOUT = 10000;

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// api/client.js
import { API_BASE_URL, defaultHeaders, getAuthHeaders } from './config';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...defaultHeaders,
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

### 6. Error Boundaries for Fetch Errors

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <DataFetchingComponent />
    </ErrorBoundary>
  );
}
```

---

## Complete Examples

### Example 1: Full-Featured User Management

```jsx
// hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/users', {
        cancelToken: signal?.token,
      });
      
      setUsers(response.data);
    } catch (err) {
      if (!axiosInstance.isCancel(err)) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cancelTokenSource = axiosInstance.CancelToken.source();
    fetchUsers(cancelTokenSource);

    return () => {
      cancelTokenSource.cancel('Component unmounted');
    };
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      setUsers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, updates);
      setUsers(prev => 
        prev.map(user => user.id === userId ? response.data : user)
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}

// components/UserManagement.jsx
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

function UserManagement() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (userData) => {
    try {
      setIsCreating(true);
      await createUser(userData);
      alert('User created successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Management</h1>
      
      <button onClick={() => handleCreate({ name: 'New User' })} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Add User'}
      </button>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => updateUser(user.id, { name: 'Updated' })}>
              Edit
            </button>
            <button onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
```

### Example 2: Infinite Scroll with Pagination

```jsx
import { useState, useEffect, useCallback, useRef } from 'react';

function useInfiniteScroll(fetchFunction) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const newItems = await fetchFunction(page, signal);

        setItems(prev => [...prev, ...newItems]);
        setHasMore(newItems.length > 0);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    return () => {
      abortController.abort();
    };
  }, [page, fetchFunction]);

  return { items, loading, error, hasMore, lastItemRef };
}

// Usage
function ProductList() {
  const fetchProducts = useCallback(async (page, signal) => {
    const response = await fetch(`/api/products?page=${page}&limit=20`, {
      signal,
    });
    return response.json();
  }, []);

  const { items, loading, error, hasMore, lastItemRef } = useInfiniteScroll(
    fetchProducts
  );

  return (
    <div>
      <h1>Products</h1>
      
      {items.map((product, index) => {
        if (items.length === index + 1) {
          return (
            <div ref={lastItemRef} key={product.id}>
              {product.name}
            </div>
          );
        }
        return <div key={product.id}>{product.name}</div>;
      })}

      {loading && <div>Loading more...</div>}
      {error && <div>Error: {error}</div>}
      {!hasMore && <div>No more items</div>}
    </div>
  );
}
```

### Example 3: Advanced Search with Debounce and Filters

```jsx
import { useState, useEffect, useRef } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 500);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const searchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          category,
          sort: sortBy,
        });

        const response = await fetch(`/api/search?${params}`, { signal });
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    searchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, category, sortBy]);

  return (
    <div>
      <div className="search-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}

      <div className="results">
        {results.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Rating: {product.rating}/5</p>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && query && (
        <div>No results found for "{query}"</div>
      )}
    </div>
  );
}

export default AdvancedSearch;
```

---

## Summary

Traditional data fetching in React requires careful handling of:

1. **useEffect patterns**: Understanding when to fetch, how to structure fetch logic, and managing dependencies
2. **Axios configuration**: Setting up instances, interceptors for auth and error handling
3. **State management**: Properly managing loading, error, and success states
4. **Abort controllers**: Preventing memory leaks and race conditions
5. **Retry logic**: Implementing exponential backoff and conditional retries
6. **Race conditions**: Using cleanup flags, abort controllers, or request IDs to prevent stale data

While modern libraries like React Query, SWR, and TanStack Query solve many of these problems automatically, understanding traditional patterns helps you:
- Debug issues in existing codebases
- Make informed decisions about when to use libraries
- Build custom solutions when needed
- Appreciate the complexity that modern libraries handle for you

Remember: Always clean up your effects, handle all possible states, and protect against race conditions!
