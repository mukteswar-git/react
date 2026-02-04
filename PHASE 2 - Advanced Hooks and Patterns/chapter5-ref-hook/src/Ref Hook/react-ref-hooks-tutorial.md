# Day 11-12: React Ref Hooks - Complete Tutorial

## Table of Contents
1. [Introduction to Refs](#introduction-to-refs)
2. [useRef Hook](#useref-hook)
3. [useRef for DOM Access](#useref-for-dom-access)
4. [useRef for Mutable Values](#useref-for-mutable-values)
5. [Difference Between Ref and State](#difference-between-ref-and-state)
6. [forwardRef Pattern](#forwardref-pattern)
7. [useImperativeHandle Hook](#useimperativehandle-hook)
8. [Best Practices](#best-practices)
9. [Common Patterns and Examples](#common-patterns-and-examples)
10. [Exercises](#exercises)

---

## Introduction to Refs

Refs provide a way to access DOM nodes or React elements created in the render method. They allow you to interact with DOM elements directly and store mutable values that persist across renders without causing re-renders.

### When to Use Refs
- Managing focus, text selection, or media playback
- Triggering imperative animations
- Integrating with third-party DOM libraries
- Storing mutable values that don't affect rendering

### When NOT to Use Refs
- Don't use refs for anything that can be done declaratively
- Avoid overusing refs - use state for data that affects rendering

---

## useRef Hook

The `useRef` hook returns a mutable ref object whose `.current` property is initialized to the passed argument.

### Basic Syntax

```javascript
const refContainer = useRef(initialValue);
```

### Key Characteristics
- Returns an object with a single `.current` property
- The returned object persists for the full lifetime of the component
- Mutating `.current` doesn't cause a re-render
- Value persists across re-renders

---

## useRef for DOM Access

The most common use case for refs is accessing DOM elements directly.

### Example 1: Focus Management

```javascript
import React, { useRef, useEffect } from 'react';

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input on component mount
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="This input is auto-focused" 
      />
    </div>
  );
}

export default AutoFocusInput;
```

### Example 2: Scroll to Element

```javascript
import React, { useRef } from 'react';

function ScrollToSection() {
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div>
      <button onClick={scrollToSection}>
        Scroll to Section
      </button>
      
      <div style={{ height: '100vh' }}>
        {/* Spacer */}
      </div>
      
      <div ref={sectionRef} style={{ padding: '20px', background: '#f0f0f0' }}>
        <h2>Target Section</h2>
        <p>You scrolled here!</p>
      </div>
    </div>
  );
}

export default ScrollToSection;
```

### Example 3: Measuring DOM Elements

```javascript
import React, { useRef, useState } from 'react';

function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const measureElement = () => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  };

  return (
    <div>
      <div 
        ref={divRef}
        style={{ 
          width: '300px', 
          height: '200px', 
          background: 'lightblue',
          padding: '20px'
        }}
      >
        <p>Resize the window and click the button!</p>
      </div>
      
      <button onClick={measureElement}>Measure Element</button>
      
      {dimensions.width > 0 && (
        <p>
          Dimensions: {dimensions.width.toFixed(2)}px × {dimensions.height.toFixed(2)}px
        </p>
      )}
    </div>
  );
}

export default MeasureElement;
```

### Example 4: Video Player Control

```javascript
import React, { useRef, useState } from 'react';

function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <video 
        ref={videoRef}
        width="500"
        src="your-video.mp4"
      />
      
      <div>
        <button onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
}

export default VideoPlayer;
```

---

## useRef for Mutable Values

Refs can store any mutable value, not just DOM references. This is useful for keeping track of values that shouldn't trigger re-renders.

### Example 1: Previous Value Tracking

```javascript
import React, { useRef, useState, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <h2>Current: {count}</h2>
      <h3>Previous: {prevCount}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### Example 2: Interval ID Storage

```javascript
import React, { useRef, useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCount(c => c + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleReset = () => {
    setCount(0);
    setIsRunning(false);
  };

  return (
    <div>
      <h1>Timer: {count}s</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Timer;
```

### Example 3: Debouncing with Ref

```javascript
import React, { useRef, useState } from 'react';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      // Simulate API call
      console.log('Searching for:', value);
      setResults([`Result for "${value}" 1`, `Result for "${value}" 2`]);
    }, 500);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchInput;
```

### Example 4: Render Count Tracker

```javascript
import React, { useRef, useState } from 'react';

function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This increments on every render but doesn't cause re-render
  renderCount.current += 1;

  return (
    <div>
      <h2>State Count: {count}</h2>
      <h3>Component Rendered: {renderCount.current} times</h3>
      <button onClick={() => setCount(count + 1)}>Increment State</button>
    </div>
  );
}

export default RenderCounter;
```

---

## Difference Between Ref and State

Understanding when to use refs versus state is crucial for writing efficient React code.

### Comparison Table

| Feature | useState | useRef |
|---------|----------|--------|
| **Triggers Re-render** | Yes | No |
| **Persists Between Renders** | Yes | Yes |
| **Mutable** | No (immutable updates) | Yes (directly mutable) |
| **Use Case** | UI data that affects rendering | Values that don't affect rendering |
| **Update Method** | Asynchronous (setState) | Synchronous (.current =) |
| **Access Time** | Available after re-render | Immediately available |

### Example: State vs Ref Comparison

```javascript
import React, { useState, useRef } from 'react';

function StateVsRef() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  const incrementState = () => {
    setStateCount(stateCount + 1);
    console.log('State after setState:', stateCount); // Shows old value!
  };

  const incrementRef = () => {
    refCount.current += 1;
    console.log('Ref after increment:', refCount.current); // Shows new value!
    // Component won't re-render!
  };

  return (
    <div>
      <h2>State Count: {stateCount}</h2>
      <h3>Ref Count: {refCount.current}</h3>
      
      <button onClick={incrementState}>
        Increment State (Re-renders)
      </button>
      
      <button onClick={incrementRef}>
        Increment Ref (No Re-render)
      </button>
      
      <button onClick={() => setStateCount(stateCount)}>
        Force Re-render to See Ref Changes
      </button>
    </div>
  );
}

export default StateVsRef;
```

### When to Use Each

**Use State When:**
- The value affects what's rendered
- You need the component to re-render when the value changes
- You're storing UI-related data

**Use Ref When:**
- Storing DOM references
- Storing values that don't affect rendering (timers, previous values)
- You need synchronous access to a value
- You want to avoid unnecessary re-renders

---

## forwardRef Pattern

`forwardRef` lets parent components access DOM nodes or component instances of their children.

### Basic Syntax

```javascript
const Component = React.forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});
```

### Example 1: Basic forwardRef

```javascript
import React, { forwardRef, useRef } from 'react';

// Child component with forwardRef
const FancyInput = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className="fancy-input"
      style={{
        padding: '10px',
        border: '2px solid blue',
        borderRadius: '5px'
      }}
      {...props}
    />
  );
});

// Parent component
function ParentComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Type here..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default ParentComponent;
```

### Example 2: forwardRef with Custom Components

```javascript
import React, { forwardRef, useRef } from 'react';

const CustomButton = forwardRef(({ children, variant = 'primary', ...props }, ref) => {
  const styles = {
    primary: { background: 'blue', color: 'white' },
    secondary: { background: 'gray', color: 'white' },
    danger: { background: 'red', color: 'white' }
  };

  return (
    <button
      ref={ref}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        ...styles[variant]
      }}
      {...props}
    >
      {children}
    </button>
  );
});

function App() {
  const buttonRef = useRef(null);

  const handleClick = () => {
    // Access button methods/properties
    buttonRef.current.blur();
    console.log('Button width:', buttonRef.current.offsetWidth);
  };

  return (
    <div>
      <CustomButton ref={buttonRef} variant="primary" onClick={handleClick}>
        Click Me
      </CustomButton>
    </div>
  );
}

export default App;
```

### Example 3: forwardRef with Multiple Elements

```javascript
import React, { forwardRef, useRef } from 'react';

const FormGroup = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>
        {label}
      </label>
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '2px solid red' : '1px solid #ccc',
          borderRadius: '4px'
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>
      )}
    </div>
  );
});

function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!emailRef.current.value) {
      emailRef.current.focus();
      return;
    }
    
    if (!passwordRef.current.value) {
      passwordRef.current.focus();
      return;
    }
    
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup
        ref={emailRef}
        label="Email"
        type="email"
        placeholder="Enter your email"
      />
      
      <FormGroup
        ref={passwordRef}
        label="Password"
        type="password"
        placeholder="Enter your password"
      />
      
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
```

---

## useImperativeHandle Hook

`useImperativeHandle` customizes the instance value that is exposed to parent components when using `forwardRef`. It allows you to control what the parent can access.

### Basic Syntax

```javascript
useImperativeHandle(ref, () => ({
  // Methods/properties to expose
}), [dependencies]);
```

### Example 1: Basic useImperativeHandle

```javascript
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';

const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  // Expose only specific methods to parent
  useImperativeHandle(ref, () => ({
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(0),
    getValue: () => count
  }));

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Count: {count}</h2>
    </div>
  );
});

function Parent() {
  const counterRef = useRef(null);

  const handleIncrement = () => {
    counterRef.current.increment();
  };

  const handleGetValue = () => {
    alert(`Current value: ${counterRef.current.getValue()}`);
  };

  return (
    <div>
      <Counter ref={counterRef} />
      <button onClick={handleIncrement}>Increment from Parent</button>
      <button onClick={() => counterRef.current.decrement()}>Decrement</button>
      <button onClick={() => counterRef.current.reset()}>Reset</button>
      <button onClick={handleGetValue}>Get Value</button>
    </div>
  );
}

export default Parent;
```

### Example 2: Custom Input with Validation

```javascript
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';

const ValidatedInput = forwardRef(({ label, validator }, ref) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    blur: () => inputRef.current.blur(),
    getValue: () => value,
    setValue: (newValue) => setValue(newValue),
    validate: () => {
      const validationError = validator ? validator(value) : '';
      setError(validationError);
      return !validationError;
    },
    clear: () => {
      setValue('');
      setError('');
    }
  }));

  const handleChange = (e) => {
    setValue(e.target.value);
    setError('');
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>
        {label}
      </label>
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '2px solid red' : '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      {error && (
        <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>
      )}
    </div>
  );
});

function RegistrationForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const emailValidator = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return '';
  };

  const passwordValidator = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = emailRef.current.validate();
    const isPasswordValid = passwordRef.current.validate();
    
    if (isEmailValid && isPasswordValid) {
      console.log('Email:', emailRef.current.getValue());
      console.log('Password:', passwordRef.current.getValue());
      alert('Form submitted successfully!');
    } else {
      if (!isEmailValid) emailRef.current.focus();
      else if (!isPasswordValid) passwordRef.current.focus();
    }
  };

  const handleClear = () => {
    emailRef.current.clear();
    passwordRef.current.clear();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ValidatedInput
        ref={emailRef}
        label="Email"
        validator={emailValidator}
      />
      
      <ValidatedInput
        ref={passwordRef}
        label="Password"
        validator={passwordValidator}
      />
      
      <button type="submit">Submit</button>
      <button type="button" onClick={handleClear}>Clear All</button>
    </form>
  );
}

export default RegistrationForm;
```

### Example 3: Modal Component with Imperative API

```javascript
import React, { forwardRef, useImperativeHandle, useState } from 'react';

const Modal = forwardRef(({ title, children }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
    isOpen: () => isOpen
  }));

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '300px',
        maxWidth: '500px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h2>{title}</h2>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
});

function App() {
  const modalRef = useRef(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modal Example</h1>
      
      <button onClick={() => modalRef.current.open()}>
        Open Modal
      </button>
      
      <button onClick={() => modalRef.current.toggle()}>
        Toggle Modal
      </button>
      
      <Modal ref={modalRef} title="Welcome!">
        <p>This is a modal controlled imperatively from the parent.</p>
        <button onClick={() => modalRef.current.close()}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
}

export default App;
```

### Example 4: Advanced Player Controller

```javascript
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';

const AudioPlayer = forwardRef(({ src }, ref) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play();
      setIsPlaying(true);
    },
    pause: () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    },
    stop: () => {
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    },
    seekTo: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    setVolume: (volume) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    isPlaying: () => isPlaying
  }));

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <audio ref={audioRef} src={src} />
      
      <div style={{ marginBottom: '10px' }}>
        <strong>{isPlaying ? '▶ Playing' : '⏸ Paused'}</strong>
      </div>
      
      <div>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          const time = parseFloat(e.target.value);
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
});

function MusicApp() {
  const playerRef = useRef(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Music Player</h1>
      
      <AudioPlayer 
        ref={playerRef}
        src="your-audio-file.mp3"
      />
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => playerRef.current.play()}>Play</button>
        <button onClick={() => playerRef.current.pause()}>Pause</button>
        <button onClick={() => playerRef.current.stop()}>Stop</button>
        <button onClick={() => playerRef.current.seekTo(30)}>Skip to 0:30</button>
        <button onClick={() => playerRef.current.setVolume(0.5)}>50% Volume</button>
      </div>
    </div>
  );
}

export default MusicApp;
```

---

## Best Practices

### 1. Minimize Direct DOM Manipulation

```javascript
// ❌ Bad: Excessive DOM manipulation
function BadExample() {
  const divRef = useRef(null);
  
  const changeStyle = () => {
    divRef.current.style.color = 'red';
    divRef.current.style.fontSize = '20px';
    divRef.current.style.background = 'yellow';
  };
  
  return <div ref={divRef}>Content</div>;
}

// ✅ Good: Use state for styling
function GoodExample() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  return (
    <div style={{
      color: isHighlighted ? 'red' : 'black',
      fontSize: isHighlighted ? '20px' : '16px',
      background: isHighlighted ? 'yellow' : 'white'
    }}>
      Content
    </div>
  );
}
```

### 2. Don't Overuse Refs

```javascript
// ❌ Bad: Using ref when state would be better
function BadCounter() {
  const countRef = useRef(0);
  
  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button onClick={() => {
        countRef.current += 1;
        // Component won't re-render!
      }}>
        Increment
      </button>
    </div>
  );
}

// ✅ Good: Use state for UI data
function GoodCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 3. Cleanup Side Effects

```javascript
// ✅ Good: Proper cleanup
function Timer() {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return <div>Timer running...</div>;
}
```

### 4. Use Callback Refs for Dynamic Conditions

```javascript
function DynamicRef() {
  const [shouldAttachRef, setShouldAttachRef] = useState(true);
  
  // Callback ref - called when element mounts/unmounts
  const callbackRef = (element) => {
    if (element && shouldAttachRef) {
      element.focus();
      console.log('Ref attached');
    }
  };
  
  return (
    <div>
      <input ref={callbackRef} />
      <button onClick={() => setShouldAttachRef(!shouldAttachRef)}>
        Toggle Ref
      </button>
    </div>
  );
}
```

### 5. Type Safety with TypeScript (Bonus)

```typescript
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

// Typed ref for DOM element
function TypedDOMRef() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return <input ref={inputRef} />;
}

// Typed imperative handle
interface PlayerHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const Player = forwardRef<PlayerHandle>((props, ref) => {
  useImperativeHandle(ref, () => ({
    play: () => console.log('Playing'),
    pause: () => console.log('Paused'),
    stop: () => console.log('Stopped')
  }));
  
  return <div>Player</div>;
});
```

---

## Common Patterns and Examples

### Pattern 1: Click Outside Hook

```javascript
import { useEffect, useRef } from 'react';

function useClickOutside(callback) {
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);
  
  return ref;
}

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px',
          marginTop: '5px'
        }}>
          Dropdown Content
        </div>
      )}
    </div>
  );
}
```

### Pattern 2: Intersection Observer

```javascript
import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  
  return [ref, isIntersecting];
}

function LazyImage({ src, alt }) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1
  });
  
  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
```

### Pattern 3: Focus Trap for Accessibility

```javascript
import { useRef, useEffect } from 'react';

function FocusTrap({ children, isActive }) {
  const containerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          lastFocusableRef.current?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          firstFocusableRef.current?.focus();
          e.preventDefault();
        }
      }
    };
    
    containerRef.current.addEventListener('keydown', handleTab);
    firstFocusableRef.current?.focus();
    
    return () => {
      containerRef.current?.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);
  
  return <div ref={containerRef}>{children}</div>;
}
```

---

## Exercises

### Exercise 1: Auto-Save Form
Create a form that auto-saves to localStorage using refs to track if the content has changed.

**Requirements:**
- Use useRef to store the previous value
- Only save when content actually changes
- Don't trigger saves on every keystroke (use debouncing)

### Exercise 2: Image Carousel
Build an image carousel with imperative controls.

**Requirements:**
- Use forwardRef for the carousel component
- Expose methods: next(), prev(), goToSlide(index)
- Use refs to track current slide index
- Parent can control carousel externally

### Exercise 3: Custom Hook - useTimeout
Create a custom hook that uses refs to manage timeouts.

**Requirements:**
- Accept callback and delay
- Clear timeout on unmount
- Allow resetting the timeout
- Return a function to cancel the timeout

### Exercise 4: Virtual Scroller
Create a virtualized list that only renders visible items.

**Requirements:**
- Use refs to measure container and item heights
- Track scroll position with ref
- Calculate which items are visible
- Only render visible items + buffer

### Exercise 5: Drawing Canvas
Build a simple drawing canvas with controls.

**Requirements:**
- Use ref for canvas element
- Expose methods via useImperativeHandle: clear(), save(), undo()
- Track drawing state without causing re-renders
- Allow parent to control canvas imperatively

---

## Summary

### Key Takeaways

1. **useRef** creates a mutable container that persists across renders without causing re-renders
2. **DOM Access** is the primary use case - focus management, scrolling, measurements, media control
3. **Mutable Values** can be stored in refs for things like timers, previous values, or any data that doesn't affect rendering
4. **State vs Ref**: Use state for UI data, refs for everything else
5. **forwardRef** allows parent components to access child DOM nodes or instances
6. **useImperativeHandle** customizes what's exposed to parents, creating clean imperative APIs
7. **Best Practice**: Prefer declarative approaches with state; use refs only when necessary

### When to Use What

- **useRef alone**: DOM access, storing mutable values
- **forwardRef**: When parent needs access to child's DOM/instance
- **useImperativeHandle**: When you want to control exactly what parent can access
- **useState**: When the value affects what's rendered

### Common Pitfalls to Avoid

1. Don't use refs for data that should trigger re-renders
2. Don't read/write ref.current during rendering
3. Remember refs update synchronously (unlike state)
4. Always cleanup side effects (intervals, listeners, etc.)
5. Don't overuse refs - React's declarative approach is usually better

---

## Additional Resources

- [React Refs Documentation](https://react.dev/reference/react/useRef)
- [forwardRef API](https://react.dev/reference/react/forwardRef)
- [useImperativeHandle API](https://react.dev/reference/react/useImperativeHandle)
- [When to Use Refs](https://react.dev/learn/referencing-values-with-refs)

Happy learning! 🚀
