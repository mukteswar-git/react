# React useEffect: Complete Tutorial (Days 5-7)

## Table of Contents

1. [Introduction to Side Effects](#introduction-to-side-effects)
2. [The useEffect Hook Explained](#the-useeffect-hook-explained)
3. [Dependency Array Rules](#dependency-array-rules)
4. [Cleanup Functions](#cleanup-functions)
5. [Data Fetching with useEffect](#data-fetching-with-useeffect)
6. [Common useEffect Mistakes](#common-useeffect-mistakes)
7. [useEffect vs useLayoutEffect](#useeffect-vs-uselayouteffect)
8. [Practice Exercises](#practice-exercises)

---

## Introduction to Side Effects

### What are Side Effects?

In React, a **side effect** is any operation that affects something outside the scope of the current function being executed. Side effects include:

- Fetching data from an API
- Directly manipulating the DOM
- Setting up subscriptions or timers
- Logging to the console
- Reading from or writing to localStorage
- Setting up event listeners

### Why We Need useEffect

React components should be pure functions when it comes to rendering. However, real applications need to interact with the outside world. The `useEffect` hook allows you to perform side effects in functional components.

```jsx
// Without useEffect (DON'T DO THIS)
function BadComponent() {
  // This runs on every render and causes problems!
  document.title = 'Bad Practice';
  
  return <div>Don't do this</div>;
}

// With useEffect (CORRECT)
function GoodComponent() {
  useEffect(() => {
    document.title = 'Good Practice';
  }, []);
  
  return <div>This is the right way</div>;
}
```

---

## The useEffect Hook Explained

### Basic Syntax

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code goes here
  
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

The `useEffect` hook takes two arguments:

1. **Effect function**: A function containing the side effect logic
2. **Dependency array** (optional): An array of values that the effect depends on

### How useEffect Works

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Count changed to: ${count}`);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Execution Flow:**

1. Component renders
2. React updates the DOM
3. Browser paints the screen
4. useEffect runs (after painting)

This is important: **useEffect runs after the browser has painted**, making it non-blocking for the visual update.

### Basic Examples

#### Example 1: Updating Document Title

```jsx
import { useState, useEffect } from 'react';

function PageTitle() {
  const [title, setTitle] = useState('Home');

  useEffect(() => {
    document.title = `My App - ${title}`;
  }, [title]);

  return (
    <div>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title"
      />
    </div>
  );
}
```

#### Example 2: Logging User Actions

```jsx
function UserTracker() {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    console.log('User has clicked:', clicks, 'times');
    // Could send analytics data here
  }, [clicks]);

  return (
    <button onClick={() => setClicks(clicks + 1)}>
      Clicked {clicks} times
    </button>
  );
}
```

---

## Dependency Array Rules

The dependency array is crucial for controlling when your effect runs. Understanding it is key to avoiding bugs.

### Three Patterns

#### 1. No Dependency Array (Run on Every Render)

```jsx
useEffect(() => {
  console.log('This runs after EVERY render');
});
```

**Use case**: Rarely needed, usually indicates a code smell.

#### 2. Empty Dependency Array (Run Once)

```jsx
useEffect(() => {
  console.log('This runs only once after initial render');
}, []);
```

**Use cases:**

- Initial data fetching
- Setting up subscriptions
- One-time initialization

```jsx
function DataLoader() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Runs only once when component mounts
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

#### 3. With Dependencies (Run When Dependencies Change)

```jsx
useEffect(() => {
  console.log('This runs when count or name changes');
}, [count, name]);
```

**Use cases:**

- Syncing with external systems based on props or state
- Re-fetching data when parameters change

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs when userId changes
    fetch(`https://api.example.com/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]); // Re-fetch when userId changes

  return <div>{user?.name || 'Loading...'}</div>;
}
```

### Dependency Array Best Practices

#### Rule 1: Include All Values Used Inside the Effect

```jsx
// ❌ WRONG - missing dependency
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  }, []); // Missing 'query'!

  return <div>{/* ... */}</div>;
}

// ✅ CORRECT
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  }, [query]); // Includes 'query'

  return <div>{/* ... */}</div>;
}
```

#### Rule 2: Use the ESLint Plugin

Install and configure the React ESLint plugin to catch dependency issues:

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
// .eslintrc.json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Rule 3: Functions as Dependencies

```jsx
// ❌ PROBLEM - function recreated every render
function Component() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    return fetch('/api/data').then(res => res.json());
  };

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); // This causes infinite loop!
}

// ✅ SOLUTION 1 - Move function inside effect
function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      return fetch('/api/data').then(res => res.json());
    };

    fetchData().then(setData);
  }, []);
}

// ✅ SOLUTION 2 - Use useCallback
import { useCallback } from 'react';

function Component() {
  const [data, setData] = useState(null);

  const fetchData = useCallback(() => {
    return fetch('/api/data').then(res => res.json());
  }, []);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]);
}
```

#### Rule 4: Objects and Arrays as Dependencies

```jsx
// ❌ PROBLEM - object recreated every render
function Component() {
  const options = { method: 'GET' }; // New object every render

  useEffect(() => {
    fetch('/api/data', options);
  }, [options]); // Infinite loop!
}

// ✅ SOLUTION 1 - Move inside effect
function Component() {
  useEffect(() => {
    const options = { method: 'GET' };
    fetch('/api/data', options);
  }, []);
}

// ✅ SOLUTION 2 - Use useMemo
import { useMemo } from 'react';

function Component() {
  const options = useMemo(() => ({ method: 'GET' }), []);

  useEffect(() => {
    fetch('/api/data', options);
  }, [options]);
}

// ✅ SOLUTION 3 - Use primitive dependencies
function Component({ method }) {
  useEffect(() => {
    const options = { method };
    fetch('/api/data', options);
  }, [method]); // Only depend on primitive value
}
```

---

## Cleanup Functions

Cleanup functions prevent memory leaks and unwanted behavior by cleaning up side effects when:

- The component unmounts
- The effect runs again (before the new effect)

### Syntax

```jsx
useEffect(() => {
  // Setup code
  
  return () => {
    // Cleanup code
  };
}, [dependencies]);
```

### Common Cleanup Scenarios

#### 1. Timers and Intervals

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup: clear interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

#### 2. Event Listeners

```jsx
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div>Mouse: {position.x}, {position.y}</div>;
}
```

#### 3. Subscriptions

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscription = chatAPI.subscribe(roomId, (message) => {
      setMessages(msgs => [...msgs, message]);
    });

    // Cleanup: unsubscribe when roomId changes or unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  return <div>{/* Display messages */}</div>;
}
```

#### 4. Async Operations (AbortController)

```jsx
function UserData({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      });

    // Cleanup: abort fetch if component unmounts or userId changes
    return () => {
      controller.abort();
    };
  }, [userId]);

  if (error) return <div>Error: {error.message}</div>;
  return <div>{user?.name || 'Loading...'}</div>;
}
```

### Cleanup Execution Order

```jsx
function EffectDemo({ id }) {
  useEffect(() => {
    console.log('1. Effect runs for id:', id);

    return () => {
      console.log('2. Cleanup runs for id:', id);
    };
  }, [id]);

  return <div>ID: {id}</div>;
}

// When id changes from 1 to 2:
// Output:
// "1. Effect runs for id: 1"
// (user changes id to 2)
// "2. Cleanup runs for id: 1"  <- cleanup of old effect
// "1. Effect runs for id: 2"   <- new effect
```

---

## Data Fetching with useEffect

Data fetching is one of the most common use cases for useEffect. Let's explore different patterns.

### Basic Pattern

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Advanced Pattern with Async/Await

```jsx
function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Can't make useEffect callback async directly
    // So we define an async function inside
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}/posts`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Posts by User {userId}</h2>
      {posts.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

### Race Condition Prevention

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prevent race conditions with a flag
    let ignore = false;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        
        // Only update if this is still the latest request
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Search failed:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }

    // Cleanup: mark this request as stale
    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <div>
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Custom Hook for Data Fetching

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
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
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data: users, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/users'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Pagination Example

```jsx
function PaginatedList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
        );
        const data = await response.json();
        
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setItems(prev => [...prev, ...data]);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      
      {loading && <div>Loading more...</div>}
      
      {hasMore && !loading && (
        <button onClick={() => setPage(p => p + 1)}>
          Load More
        </button>
      )}
      
      {!hasMore && <div>No more items</div>}
    </div>
  );
}
```

---

## Common useEffect Mistakes

### Mistake 1: Infinite Loops

```jsx
// ❌ WRONG - Infinite loop
function BadComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // Updates state every render
  }); // No dependency array!

  return <div>{count}</div>;
}

// ✅ CORRECT
function GoodComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array

  return <div>{count}</div>;
}
```

### Mistake 2: Missing Dependencies

```jsx
// ❌ WRONG - Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Always uses initial count value!
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Missing 'count' dependency

  return <div>{count}</div>;
}

// ✅ CORRECT - Use functional update
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1); // Uses latest count
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No dependencies needed!

  return <div>{count}</div>;
}
```

### Mistake 3: Not Cleaning Up

```jsx
// ❌ WRONG - Memory leak
function BadSubscription({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = api.subscribe(userId, setData);
    // No cleanup! Subscription continues after unmount
  }, [userId]);

  return <div>{data}</div>;
}

// ✅ CORRECT
function GoodSubscription({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = api.subscribe(userId, setData);

    return () => {
      subscription.unsubscribe(); // Clean up!
    };
  }, [userId]);

  return <div>{data}</div>;
}
```

### Mistake 4: Fetching in Wrong Order

```jsx
// ❌ WRONG - Can cause race conditions
function BadSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(setResults); // May set results from old query!
  }, [query]);

  return <div>{/* ... */}</div>;
}

// ✅ CORRECT - Use ignore flag or AbortController
function GoodSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          setResults(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  return <div>{/* ... */}</div>;
}
```

### Mistake 5: Using Async Effect Directly

```jsx
// ❌ WRONG - useEffect cannot be async
function BadComponent() {
  useEffect(async () => {
    const data = await fetchData();
    // This doesn't work!
  }, []);
}

// ✅ CORRECT - Define async function inside
function GoodComponent() {
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      setData(data);
    };

    loadData();
  }, []);
}
```

### Mistake 6: Incorrect Dependencies with Objects

```jsx
// ❌ WRONG - Object reference changes every render
function BadComponent() {
  const user = { name: 'John', age: 30 };

  useEffect(() => {
    console.log('User changed:', user);
  }, [user]); // Runs every render!
}

// ✅ CORRECT - Depend on specific properties
function GoodComponent() {
  const user = { name: 'John', age: 30 };

  useEffect(() => {
    console.log('User changed:', user);
  }, [user.name, user.age]); // Or use useMemo for user object
}
```

### Mistake 7: Modifying State During Render

```jsx
// ❌ WRONG - Side effect during render
function BadComponent({ data }) {
  const [processed, setProcessed] = useState([]);

  if (data.length > 0) {
    setProcessed(data.map(item => item.toUpperCase()));
    // This causes issues!
  }

  return <div>{processed}</div>;
}

// ✅ CORRECT - Use useEffect
function GoodComponent({ data }) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(data.map(item => item.toUpperCase()));
  }, [data]);

  return <div>{processed}</div>;
}

// ✅ EVEN BETTER - Derive state
function BestComponent({ data }) {
  const processed = data.map(item => item.toUpperCase());
  return <div>{processed}</div>;
}
```

---

## useEffect vs useLayoutEffect

Both hooks are similar, but they differ in **when** they execute.

### Timing Differences

```text
Component Render → DOM Update → useLayoutEffect → Browser Paint → useEffect
```

#### useEffect (Default Choice)

- Runs **after** the browser has painted
- Non-blocking for visual updates
- Use for most side effects

#### useLayoutEffect (Special Cases Only)

- Runs **before** the browser paints
- Blocks visual updates until complete
- Use when you need to read layout or prevent visual flicker

### When to Use useLayoutEffect

#### Use Case 1: Measuring DOM Elements

```jsx
import { useRef, useLayoutEffect, useState } from 'react';

function TooltipMeasure() {
  const tooltipRef = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    // Measure before browser paints
    const height = tooltipRef.current.getBoundingClientRect().height;
    setTooltipHeight(height);
  }, []);

  return (
    <div 
      ref={tooltipRef}
      style={{ 
        position: 'absolute',
        top: `calc(100% + ${tooltipHeight}px)` 
      }}
    >
      Tooltip content
    </div>
  );
}
```

#### Use Case 2: Preventing Visual Flicker

```jsx
function AnimatedBox() {
  const boxRef = useRef(null);

  // ✅ useLayoutEffect - no flicker
  useLayoutEffect(() => {
    // This happens before paint, so user never sees initial state
    boxRef.current.style.transform = 'translateX(100px)';
  }, []);

  // ❌ useEffect - would cause flicker
  // useEffect(() => {
  //   // User briefly sees box at x=0, then it jumps to x=100
  //   boxRef.current.style.transform = 'translateX(100px)';
  // }, []);

  return <div ref={boxRef}>Animated Box</div>;
}
```

#### Use Case 3: Synchronizing with Third-Party Libraries

```jsx
import { useRef, useLayoutEffect } from 'react';
import Chart from 'chart.js';

function ChartComponent({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Initialize chart before browser paints
    const ctx = canvasRef.current.getContext('2d');
    
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}
```

### Comparison Table

| Feature | useEffect | useLayoutEffect |
| --------- | ----------- | ----------------- |
| **Execution** | After browser paint | Before browser paint |
| **Blocking** | Non-blocking | Blocks paint |
| **Use for** | Data fetching, subscriptions, most side effects | DOM measurements, preventing flicker |
| **Performance** | Better (doesn't block render) | Can hurt performance if overused |
| **SSR** | Works on server | Warns on server (use useEffect + isomorphic-layout-effect if needed) |

### Example Showing the Difference

```jsx
import { useState, useEffect, useLayoutEffect } from 'react';

function EffectComparison() {
  const [color, setColor] = useState('red');

  // This will show a brief flash of red before turning blue
  useEffect(() => {
    setColor('blue');
  }, []);

  return <div style={{ color }}>Hello World</div>;
}

function LayoutEffectComparison() {
  const [color, setColor] = useState('red');

  // This will never show red; blue is set before first paint
  useLayoutEffect(() => {
    setColor('blue');
  }, []);

  return <div style={{ color }}>Hello World</div>;
}
```

### Best Practices

1. **Default to useEffect**: Unless you have a specific reason to use useLayoutEffect
2. **Measure performance**: If useLayoutEffect causes janky rendering, reconsider your approach
3. **Server-side rendering**: useLayoutEffect triggers a warning on the server. Use conditional rendering if needed:

```jsx
import { useEffect, useLayoutEffect } from 'react';

// Safe for SSR
const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Component() {
  useIsomorphicLayoutEffect(() => {
    // DOM manipulation
  }, []);
}
```

---

## Practice Exercises

### Exercise 1: Digital Clock

Create a digital clock that updates every second.

```jsx
function DigitalClock() {
  // Your code here
  // Display current time in HH:MM:SS format
}
```

<details>
<summary>Solution</summary>

```jsx
import { useState, useEffect } from 'react';

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
      {hours}:{minutes}:{seconds}
    </div>
  );
}
```

</details>

### Exercise 2: Window Size Tracker

Track and display the window dimensions.

```jsx
function WindowSize() {
  // Your code here
  // Show width x height
  // Update when window resizes
}
```

<details>
<summary>Solution</summary>

```jsx
import { useState, useEffect } from 'react';

function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      Window size: {size.width} x {size.height}
    </div>
  );
}
```

</details>

### Exercise 3: Document Title Sync

Update document title to match input value.

```jsx
function TitleSync() {
  // Your code here
  // Input field that updates document.title
  // Reset title when component unmounts
}
```

<details>
<summary>Solution</summary>

```jsx
import { useState, useEffect } from 'react';

function TitleSync() {
  const [title, setTitle] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    
    document.title = title || 'React App';

    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter page title"
    />
  );
}
```

</details>

### Exercise 4: Debounced Search

Implement a search that only fires after user stops typing for 500ms.

```jsx
function DebouncedSearch() {
  // Your code here
  // Search input with debounce
  // Show search results
}
```

<details>
<summary>Solution</summary>

```jsx
import { useState, useEffect } from 'react';

function DebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch when debounced term changes
  useEffect(() => {
    if (!debouncedTerm) {
      setResults([]);
      return;
    }

    setLoading(true);

    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${debouncedTerm}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [debouncedTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      
      {loading && <div>Searching...</div>}
      
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

### Exercise 5: Local Storage Sync

Create a form that persists to localStorage.

```jsx
function PersistentForm() {
  // Your code here
  // Form with name and email
  // Save to localStorage on change
  // Load from localStorage on mount
}
```

<details>
<summary>Solution</summary>

```jsx
import { useState, useEffect } from 'react';

function PersistentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('formData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
      </div>
    </form>
  );
}
```

</details>

---

## Key Takeaways

1. **useEffect runs after render** - It's for side effects, not for computing derived state
2. **Always specify dependencies** - Use the ESLint plugin to catch mistakes
3. **Clean up your effects** - Prevent memory leaks with cleanup functions
4. **Watch out for infinite loops** - Missing or incorrect dependencies are the main cause
5. **Use functional updates** - When updating state based on previous state
6. **Prefer useEffect over useLayoutEffect** - Unless you need synchronous DOM updates
7. **One effect per concern** - Don't mix unrelated logic in a single effect
8. **Custom hooks for reusable logic** - Extract common effect patterns

---

## Additional Resources

- [React Official Docs: useEffect](https://react.dev/reference/react/useEffect)
- [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) by Dan Abramov
- [useEffect vs useLayoutEffect](https://kentcdodds.com/blog/useeffect-vs-uselayouteffect)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

## Next Steps

Now that you understand useEffect, you're ready to:

- Learn about `useContext` for state management
- Explore `useReducer` for complex state logic
- Study `useMemo` and `useCallback` for performance optimization
- Build real-world applications with data fetching and side effects

Happy coding! 🚀
