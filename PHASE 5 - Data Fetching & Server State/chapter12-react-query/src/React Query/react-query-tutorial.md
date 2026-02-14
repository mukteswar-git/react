# Day 27-28: React Query (TanStack Query) - Complete Tutorial

## Table of Contents
1. [Why React Query?](#why-react-query)
2. [Installation and Setup](#installation-and-setup)
3. [useQuery Hook](#usequery-hook)
4. [useMutation Hook](#usemutation-hook)
5. [Query Keys and Caching](#query-keys-and-caching)
6. [Automatic Refetching](#automatic-refetching)
7. [Optimistic Updates](#optimistic-updates)
8. [Infinite Queries](#infinite-queries)
9. [Prefetching](#prefetching)
10. [Query Invalidation](#query-invalidation)
11. [Advanced Patterns](#advanced-patterns)
12. [Best Practices](#best-practices)

---

## Why React Query?

### The Problem with Traditional Data Fetching

**Traditional Approach:**
```javascript
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}
```

**Problems:**
- No caching (refetch on every mount)
- No background updates
- No request deduplication
- Manual loading/error state management
- No automatic retries
- No garbage collection
- Stale data management is complex

### React Query Solution

React Query solves these problems by providing:

✅ **Automatic Caching** - Smart caching with configurable stale times
✅ **Background Refetching** - Keep data fresh automatically
✅ **Request Deduplication** - Multiple components, one request
✅ **Automatic Retries** - Configurable retry logic
✅ **Garbage Collection** - Clean up unused data
✅ **Optimistic Updates** - Instant UI updates
✅ **Pagination & Infinite Scroll** - Built-in support
✅ **Prefetching** - Load data before it's needed
✅ **DevTools** - Powerful debugging interface

---

## Installation and Setup

### Install React Query

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

### Install DevTools (Optional but Recommended)

```bash
npm install @tanstack/react-query-devtools
```

### Basic Setup

```javascript
// src/App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

---

## useQuery Hook

The `useQuery` hook is used for fetching data (GET requests).

### Basic Usage

```javascript
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Query with Parameters

```javascript
function UserPosts({ userId }) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', userId], // userId is part of the key
    queryFn: async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      return response.json();
    },
    enabled: !!userId, // Only run if userId exists
  });

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div>
      {posts?.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

### Query States

```javascript
function DataComponent() {
  const {
    data,
    error,
    isLoading,      // Initial loading
    isFetching,     // Any fetch (including background)
    isError,        // Error state
    isSuccess,      // Success state
    status,         // 'loading' | 'error' | 'success'
    fetchStatus,    // 'fetching' | 'paused' | 'idle'
  } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  return (
    <div>
      {isLoading && <p>Initial loading...</p>}
      {isFetching && !isLoading && <p>Updating...</p>}
      {isError && <p>Error: {error.message}</p>}
      {isSuccess && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Custom Query Hook

```javascript
// hooks/useUsers.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users');
      return data;
    },
  });
}

// Usage in component
function UsersList() {
  const { data: users, isLoading } = useUsers();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Dependent Queries

```javascript
function UserProfile({ userId }) {
  // First query - get user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query - depends on first
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => fetchUserProjects(user.id),
    enabled: !!user?.id, // Only run when user.id exists
  });

  return (
    <div>
      <h2>{user?.name}</h2>
      <ProjectsList projects={projects} />
    </div>
  );
}
```

---

## useMutation Hook

The `useMutation` hook is used for creating, updating, or deleting data (POST, PUT, PATCH, DELETE).

### Basic Usage

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation.mutate({
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>User created successfully!</p>}
    </form>
  );
}
```

### Update Mutation

```javascript
function UpdateUser({ user }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the cache directly
      queryClient.setQueryData(['user', user.id], data);
      // Or invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
      Update User
    </button>
  );
}
```

### Delete Mutation

```javascript
function DeleteUser({ userId }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button 
      onClick={() => deleteMutation.mutate(userId)}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Mutation with Error Handling

```javascript
function TodoForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

      // Return context with the snapshot
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previousTodos);
      console.error('Error creating todo:', err);
    },
    onSuccess: () => {
      // Refetch after success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate({ title: e.target.title.value });
    }}>
      <input name="title" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

---

## Query Keys and Caching

Query keys are used to identify and cache queries uniquely.

### Query Key Basics

```javascript
// Simple key
useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

// Key with parameter
useQuery({ queryKey: ['todo', todoId], queryFn: () => fetchTodo(todoId) });

// Key with multiple parameters
useQuery({ 
  queryKey: ['todos', { status, page, limit }], 
  queryFn: () => fetchTodos(status, page, limit) 
});

// Hierarchical keys
useQuery({ queryKey: ['users', userId, 'posts'], queryFn: fetchUserPosts });
```

### Query Key Best Practices

```javascript
// ❌ Bad - strings can collide
useQuery({ queryKey: ['todos' + todoId], ... });

// ✅ Good - array format
useQuery({ queryKey: ['todos', todoId], ... });

// ❌ Bad - objects without consistent order
useQuery({ queryKey: [{ page, status }], ... });

// ✅ Good - structured and ordered
useQuery({ queryKey: ['todos', { status, page }], ... });
```

### Query Key Factory

```javascript
// queryKeys.js
export const queryKeys = {
  all: ['todos'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id) => [...queryKeys.details(), id] as const,
};

// Usage
function TodosList({ filters }) {
  const { data } = useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => fetchTodos(filters),
  });
}

function TodoDetail({ id }) {
  const { data } = useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => fetchTodo(id),
  });
}
```

### Cache Configuration

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time until data is considered stale (default: 0)
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Time until inactive queries are removed (default: 5 minutes)
      cacheTime: 1000 * 60 * 10, // 10 minutes

      // Refetch on window focus (default: true)
      refetchOnWindowFocus: false,

      // Refetch on reconnect (default: true)
      refetchOnReconnect: true,

      // Refetch on mount (default: true)
      refetchOnMount: true,

      // Retry failed queries (default: 3)
      retry: 2,

      // Retry delay (default: exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Per-Query Configuration

```javascript
function CriticalData() {
  const { data } = useQuery({
    queryKey: ['critical-data'],
    queryFn: fetchCriticalData,
    staleTime: 1000 * 30, // 30 seconds
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 5,
    retryDelay: 1000,
  });
}

function StaticData() {
  const { data } = useQuery({
    queryKey: ['static-data'],
    queryFn: fetchStaticData,
    staleTime: Infinity, // Never stale
    cacheTime: Infinity, // Never garbage collected
  });
}
```

---

## Automatic Refetching

React Query automatically refetches data in several scenarios.

### Refetch on Window Focus

```javascript
// Global configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // default
    },
  },
});

// Per-query configuration
function Users() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false, // Disable for this query
  });
}
```

### Refetch on Mount

```javascript
function Component() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    refetchOnMount: true, // 'always' | true | false
  });
}
```

### Refetch on Reconnect

```javascript
function Component() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    refetchOnReconnect: true, // default
  });
}
```

### Polling / Refetch Interval

```javascript
function LiveData() {
  const { data } = useQuery({
    queryKey: ['live-data'],
    queryFn: fetchLiveData,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

// Conditional polling
function ConditionalPoll() {
  const { data } = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: (data) => {
      // Stop polling if status is 'completed'
      return data?.status === 'completed' ? false : 2000;
    },
  });
}

// Poll only when window is focused
function FocusPoll() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    refetchInterval: 3000,
    refetchIntervalInBackground: false, // Don't poll in background
  });
}
```

### Manual Refetch

```javascript
function ManualRefetch() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  return (
    <div>
      <button onClick={() => refetch()} disabled={isRefetching}>
        {isRefetching ? 'Refreshing...' : 'Refresh'}
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Refetch with Query Client

```javascript
function RefetchWithClient() {
  const queryClient = useQueryClient();

  const refetchAll = () => {
    queryClient.refetchQueries(); // Refetch all queries
  };

  const refetchUsers = () => {
    queryClient.refetchQueries({ queryKey: ['users'] });
  };

  const refetchActive = () => {
    queryClient.refetchQueries({ type: 'active' });
  };

  return (
    <div>
      <button onClick={refetchAll}>Refetch All</button>
      <button onClick={refetchUsers}>Refetch Users</button>
      <button onClick={refetchActive}>Refetch Active</button>
    </div>
  );
}
```

---

## Optimistic Updates

Optimistic updates allow you to update the UI immediately before the server responds.

### Basic Optimistic Update

```javascript
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const updateTodo = useMutation({
    mutationFn: (updatedTodo) => 
      fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTodo),
      }),
    
    // Before mutation
    onMutate: async (updatedTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update cache
      queryClient.setQueryData(['todos'], (old) =>
        old.map((t) => (t.id === todo.id ? { ...t, ...updatedTodo } : t))
      );

      // Return rollback context
      return { previousTodos };
    },

    // On error, rollback
    onError: (err, updatedTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleComplete = () => {
    updateTodo.mutate({ completed: !todo.completed });
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
    </div>
  );
}
```

### Optimistic Create

```javascript
function CreateTodo() {
  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: (newTodo) =>
      fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
      }).then(res => res.json()),

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData(['todos']);

      // Add optimistic todo with temporary ID
      queryClient.setQueryData(['todos'], (old) => [
        ...old,
        { ...newTodo, id: Date.now(), status: 'pending' },
      ]);

      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },

    onSuccess: (data) => {
      // Replace temporary todo with real one from server
      queryClient.setQueryData(['todos'], (old) =>
        old.map((todo) =>
          todo.status === 'pending' && todo.id === data.tempId
            ? data
            : todo
        )
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createTodo.mutate({ title: e.target.title.value });
    }}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  );
}
```

### Optimistic Delete

```javascript
function DeleteTodo({ todoId }) {
  const queryClient = useQueryClient();

  const deleteTodo = useMutation({
    mutationFn: (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically remove from cache
      queryClient.setQueryData(['todos'], (old) =>
        old.filter((todo) => todo.id !== deletedId)
      );

      return { previousTodos };
    },

    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <button onClick={() => deleteTodo.mutate(todoId)}>
      Delete
    </button>
  );
}
```

---

## Infinite Queries

Infinite queries are used for pagination and infinite scrolling.

### Basic Infinite Query

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `https://api.example.com/users?page=${pageParam}&limit=10`
      );
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number or undefined if no more pages
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error loading users</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.users.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}
```

### Bi-directional Infinite Query

```javascript
function BiDirectionalInfinite() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['messages'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/api/messages?cursor=${pageParam}&limit=20`
      );
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    initialPageParam: 0,
  });

  return (
    <div>
      <button
        onClick={() => fetchPreviousPage()}
        disabled={!hasPreviousPage || isFetchingPreviousPage}
      >
        {isFetchingPreviousPage ? 'Loading...' : 'Load Older'}
      </button>

      {data.pages.map((page, i) => (
        <div key={i}>
          {page.messages.map((message) => (
            <div key={message.id}>{message.text}</div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load Newer'}
      </button>
    </div>
  );
}
```

### Infinite Scroll with Intersection Observer

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

function InfiniteScroll() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/posts?page=${pageParam}`);
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map((post) => (
            <article key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))}
        </div>
      ))}

      {/* Loading trigger */}
      <div ref={ref} style={{ height: '20px' }}>
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
  );
}
```

### Infinite Query with Search

```javascript
function SearchableInfinite({ searchTerm }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/search?q=${searchTerm}&page=${pageParam}`
      );
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextPage || undefined;
    },
    initialPageParam: 1,
    enabled: searchTerm.length > 0,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.results.map((result) => (
            <div key={result.id}>{result.title}</div>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Prefetching

Prefetching allows you to load data before it's needed.

### Manual Prefetching

```javascript
import { useQueryClient } from '@tanstack/react-query';

function UsersList() {
  const queryClient = useQueryClient();

  const prefetchUser = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          <Link to={`/user/${user.id}`}>
            {user.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

### Prefetch on Route Change

```javascript
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

function ProductsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleProductClick = async (productId) => {
    // Prefetch before navigation
    await queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
    });

    navigate(`/product/${productId}`);
  };

  return (
    <div>
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => handleProductClick(product.id)}
        >
          {product.name}
        </button>
      ))}
    </div>
  );
}
```

### Prefetch Next Page

```javascript
function PaginatedList({ page }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
  });

  useEffect(() => {
    // Prefetch next page
    if (data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['posts', page + 1],
        queryFn: () => fetchPosts(page + 1),
      });
    }
  }, [data, page, queryClient]);

  return (
    <div>
      {data?.posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Prefetch with ensureQueryData

```javascript
function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  // Ensure data exists, fetch if not
  useEffect(() => {
    queryClient.ensureQueryData({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  }, [userId, queryClient]);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return <div>{user?.name}</div>;
}
```

### Prefetch Infinite Query

```javascript
function PrefetchInfinite() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ['posts'],
      queryFn: async ({ pageParam = 1 }) => {
        return fetchPosts(pageParam);
      },
      initialPageParam: 1,
      pages: 3, // Prefetch first 3 pages
    });
  }, [queryClient]);

  return <PostsList />;
}
```

---

## Query Invalidation

Query invalidation marks queries as stale and triggers refetching.

### Basic Invalidation

```javascript
import { useQueryClient } from '@tanstack/react-query';

function CreatePost() {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    }),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return <button onClick={() => createPost.mutate(data)}>Create</button>;
}
```

### Invalidate Multiple Queries

```javascript
function UpdateUser({ userId }) {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: updateUserAPI,
    onSuccess: () => {
      // Invalidate all queries that start with 'user'
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // This will invalidate:
      // ['user', 1]
      // ['user', 1, 'posts']
      // ['user', 2]
      // etc.
    },
  });
}
```

### Selective Invalidation

```javascript
function ManageUsers() {
  const queryClient = useQueryClient();

  const deleteUser = useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: (data, deletedUserId) => {
      // Only invalidate specific user
      queryClient.invalidateQueries({
        queryKey: ['user', deletedUserId],
      });

      // Invalidate user list
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: true, // Only exact match
      });
    },
  });
}
```

### Invalidate with Predicate

```javascript
function RefreshData() {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    // Invalidate all active queries
    queryClient.invalidateQueries({
      predicate: (query) => query.state.status === 'success',
    });
  };

  const refreshStale = () => {
    // Invalidate only stale queries
    queryClient.invalidateQueries({
      predicate: (query) => query.isStale(),
    });
  };

  return (
    <div>
      <button onClick={refreshAll}>Refresh All</button>
      <button onClick={refreshStale}>Refresh Stale</button>
    </div>
  );
}
```

### Invalidate vs Remove vs Reset

```javascript
function QueryManagement() {
  const queryClient = useQueryClient();

  // Mark as stale and refetch (if active)
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  // Remove from cache completely
  const remove = () => {
    queryClient.removeQueries({ queryKey: ['users'] });
  };

  // Reset to initial state
  const reset = () => {
    queryClient.resetQueries({ queryKey: ['users'] });
  };

  return (
    <div>
      <button onClick={invalidate}>Invalidate</button>
      <button onClick={remove}>Remove</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Invalidation with Refetch Control

```javascript
function ControlledInvalidation() {
  const queryClient = useQueryClient();

  const handleUpdate = () => {
    // Invalidate but don't refetch
    queryClient.invalidateQueries({
      queryKey: ['users'],
      refetchType: 'none', // 'active' | 'inactive' | 'all' | 'none'
    });
  };

  const handleUpdateAndRefetch = () => {
    // Invalidate and refetch all (even inactive)
    queryClient.invalidateQueries({
      queryKey: ['users'],
      refetchType: 'all',
    });
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update (No Refetch)</button>
      <button onClick={handleUpdateAndRefetch}>Update & Refetch All</button>
    </div>
  );
}
```

---

## Advanced Patterns

### Initial Data from Cache

```javascript
function UserDetails({ userId }) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    initialData: () => {
      // Get data from the users list cache
      const users = queryClient.getQueryData(['users']);
      return users?.find((u) => u.id === userId);
    },
    initialDataUpdatedAt: () => {
      // Preserve the timestamp from the list query
      return queryClient.getQueryState(['users'])?.dataUpdatedAt;
    },
  });

  return <div>{user?.name}</div>;
}
```

### Placeholder Data

```javascript
function UserProfile({ userId }) {
  const { data: user, isPlaceholderData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    placeholderData: {
      id: userId,
      name: 'Loading...',
      email: 'loading@example.com',
    },
  });

  return (
    <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Query Cancellation

```javascript
import { useQuery } from '@tanstack/react-query';

function SearchResults({ query }) {
  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async ({ signal }) => {
      // Use AbortController signal
      const response = await fetch(`/api/search?q=${query}`, {
        signal, // Pass signal to fetch
      });
      return response.json();
    },
    enabled: query.length > 0,
  });

  return (
    <div>
      {isLoading && <p>Searching...</p>}
      {data?.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### Parallel Queries

```javascript
function Dashboard() {
  const users = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const posts = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
  const todos = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

  // All queries run in parallel
  if (users.isLoading || posts.isLoading || todos.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UsersList users={users.data} />
      <PostsList posts={posts.data} />
      <TodosList todos={todos.data} />
    </div>
  );
}
```

### Parallel Queries with useQueries

```javascript
import { useQueries } from '@tanstack/react-query';

function MultipleUsers({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  const isLoading = userQueries.some((query) => query.isLoading);
  const allData = userQueries.map((query) => query.data);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        allData.map((user) => <div key={user.id}>{user.name}</div>)
      )}
    </div>
  );
}
```

### Query Filters

```javascript
function QueryFilters() {
  const queryClient = useQueryClient();

  const invalidateAllUsers = () => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
      exact: false, // Match all queries starting with 'user'
    });
  };

  const invalidateActive = () => {
    queryClient.invalidateQueries({
      type: 'active', // 'active' | 'inactive' | 'all'
    });
  };

  const invalidateStale = () => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.isStale() && query.queryKey[0] === 'user';
      },
    });
  };
}
```

### SSR / Initial Data

```javascript
// Server-side
export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

// Client-side
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
```

---

## Best Practices

### 1. Use Query Key Factories

```javascript
// ✅ Good - centralized query keys
export const queryKeys = {
  todos: {
    all: ['todos'],
    lists: () => [...queryKeys.todos.all, 'list'],
    list: (filters) => [...queryKeys.todos.lists(), filters],
    details: () => [...queryKeys.todos.all, 'detail'],
    detail: (id) => [...queryKeys.todos.details(), id],
  },
};
```

### 2. Create Custom Hooks

```javascript
// hooks/useTodos.js
export function useTodos(filters) {
  return useQuery({
    queryKey: queryKeys.todos.list(filters),
    queryFn: () => fetchTodos(filters),
  });
}

export function useTodo(id) {
  return useQuery({
    queryKey: queryKeys.todos.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    },
  });
}
```

### 3. Handle Errors Properly

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('Query error:', error);
        // Show toast notification
      },
      retry: (failureCount, error) => {
        // Don't retry on 404
        if (error.response?.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        // Show error toast
      },
    },
  },
});
```

### 4. Use Appropriate Stale Times

```javascript
// Real-time data - short stale time
useQuery({
  queryKey: ['live-prices'],
  queryFn: fetchPrices,
  staleTime: 0, // Always stale
  refetchInterval: 1000,
});

// Frequently updated - medium stale time
useQuery({
  queryKey: ['user-notifications'],
  queryFn: fetchNotifications,
  staleTime: 30000, // 30 seconds
});

// Rarely updated - long stale time
useQuery({
  queryKey: ['user-profile'],
  queryFn: fetchProfile,
  staleTime: 300000, // 5 minutes
});

// Static data - infinite stale time
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: Infinity,
});
```

### 5. Optimize Infinite Queries

```javascript
// ✅ Good - flat structure
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  initialPageParam: 0,
  // Limit pages kept in memory
  maxPages: 5,
});
```

### 6. Use Optimistic Updates Wisely

```javascript
// ✅ Good - with proper rollback
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (updatedTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => /* update */);
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['todos'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### 7. Avoid Over-fetching

```javascript
// ❌ Bad - fetches all data always
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// ✅ Good - conditional fetching
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId && needsUserData,
  staleTime: 300000,
});
```

### 8. Structure for Scale

```javascript
// api/todos.js
export const todosAPI = {
  getAll: (filters) => axios.get('/todos', { params: filters }),
  getById: (id) => axios.get(`/todos/${id}`),
  create: (data) => axios.post('/todos', data),
  update: (id, data) => axios.put(`/todos/${id}`, data),
  delete: (id) => axios.delete(`/todos/${id}`),
};

// hooks/useTodos.js
export const useTodos = (filters) => {
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => todosAPI.getAll(filters),
  });
};

// components/TodoList.jsx
function TodoList({ filters }) {
  const { data, isLoading } = useTodos(filters);
  // Component logic
}
```

### 9. Monitor Performance

```javascript
// Add performance monitoring
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSuccess: (data, query) => {
        console.log(`Query ${query.queryKey} succeeded in ${query.state.dataUpdatedAt - query.state.fetchedAt}ms`);
      },
    },
  },
});
```

### 10. Use TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  users: User[];
  total: number;
}

function useUsers() {
  return useQuery<UsersResponse, Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

function useCreateUser() {
  return useMutation<User, Error, Partial<User>>({
    mutationFn: createUser,
  });
}
```

---

## Summary

React Query provides powerful tools for managing server state:

✅ **useQuery** - Fetch and cache data
✅ **useMutation** - Create, update, delete data
✅ **Query Keys** - Unique identifiers for caching
✅ **Automatic Refetching** - Keep data fresh
✅ **Optimistic Updates** - Instant UI feedback
✅ **Infinite Queries** - Pagination made easy
✅ **Prefetching** - Load data ahead of time
✅ **Query Invalidation** - Smart cache updates

React Query eliminates boilerplate, provides excellent defaults, and scales from simple to complex data fetching scenarios.

---

## Additional Resources

- [Official Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Examples Repository](https://github.com/TanStack/query/tree/main/examples)
- [Community Examples](https://tanstack.com/query/latest/docs/react/examples/react/basic)

Happy querying! 🚀
