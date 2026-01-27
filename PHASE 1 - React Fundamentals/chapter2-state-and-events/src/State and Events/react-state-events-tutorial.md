# Day 3-4: React State & Events - Complete Tutorial

## Table of Contents

1. [Introduction to State](#introduction-to-state)
2. [useState Hook Deep Dive](#usestate-hook-deep-dive)
3. [Event Handling in React](#event-handling-in-react)
4. [Controlled vs Uncontrolled Components](#controlled-vs-uncontrolled-components)
5. [Form Handling](#form-handling)
6. [State Updates and Immutability](#state-updates-and-immutability)
7. [Lifting State Up](#lifting-state-up)
8. [State Batching](#state-batching)
9. [Best Practices](#best-practices)
10. [Practice Exercises](#practice-exercises)

---

## Introduction to State

State is data that changes over time in your application. Unlike props (which are passed from parent to child), state is managed within a component and can be updated by that component.

### Why State Matters

- Makes components interactive and dynamic
- Triggers re-renders when updated
- Enables user-driven changes to the UI
- Core to building modern web applications

---

## useState Hook Deep Dive

### Basic Syntax

```jsx
import { useState } from 'react';

function Counter() {
  // [stateValue, setterFunction] = useState(initialValue)
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

### Key Concepts

#### 1. State Declaration

```jsx
const [state, setState] = useState(initialValue);

```

- `state`: Current value
- `setState`: Function to update the state
- `initialValue`: Starting value (can be any type)

#### 2. Multiple State Variables

```jsx
function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hobbies, setHobbies] = useState([]);

  return <div>{/* component JSX */}</div>;
}
```

#### 3. Different Data Types as State

```jsx
// String
const [text, setText] = useState('Hello');

// Number
const [count, setCount] = useState(0);

// Boolean
const [isVisible, setIsVisible] = useState(true);

// Array
const [items, setItems] = useState([]);

// Object
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

// Null/Undefined
const [data, setData] = useState(null);
```

#### 4. Lazy Initialization

When initial state requires expensive computation:

```jsx
function ExpensiveComponent() {
  // ❌ Bad: Runs on every render
  const [state, setState] = useState(computeExpensiveValue());

  // ✅ Good: Runs only once
  const [state, setState] = useState(() => {
    return computeExpensiveValue();
  });

  return <div>{state}</div>;
}
```

#### 5. Functional Updates

When new state depends on previous state:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ May cause issues with rapid updates
  const increment = () => setCount(count + 1);

  // ✅ Always uses latest state
  const incrementSafe = () => setCount(prevCount => prevCount + 1);

  // Example with multiple clicks
  const incrementThreeTimes = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    // Correctly adds 3
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementSafe}>Increment</button>
      <button onClick={incrementThreeTimes}>+3</button>
    </div>
  );
}
```

---

## Event Handling in React

### Basic Event Handling

React uses synthetic events (cross-browser wrapper around native events).

```jsx
function EventDemo() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  const handleClickWithParam = (message) => {
    console.log(message);
  };

  return (
    <div>
      {/* Method 1: Inline arrow function */}
      <button onClick={() => console.log('Clicked!')}>
        Click Me
      </button>

      {/* Method 2: Reference to function */}
      <button onClick={handleClick}>
        Click Me
      </button>

      {/* Method 3: Arrow function with parameters */}
      <button onClick={() => handleClickWithParam('Hello!')}>
        Click Me
      </button>
    </div>
  );
}
```

### Common Events

```jsx
function EventTypes() {
  const [status, setStatus] = useState('');

  return (
    <div>
      {/* Click Events */}
      <button onClick={() => setStatus('Clicked')}>Click</button>
      <button onDoubleClick={() => setStatus('Double Clicked')}>
        Double Click
      </button>

      {/* Mouse Events */}
      <div
        onMouseEnter={() => setStatus('Mouse Entered')}
        onMouseLeave={() => setStatus('Mouse Left')}
        onMouseMove={() => setStatus('Mouse Moving')}
        style={{ padding: '20px', background: '#f0f0f0' }}
      >
        Hover over me
      </div>

      {/* Keyboard Events */}
      <input
        onKeyDown={(e) => setStatus(`Key Down: ${e.key}`)}
        onKeyUp={(e) => setStatus(`Key Up: ${e.key}`)}
        onKeyPress={(e) => setStatus(`Key Press: ${e.key}`)}
        placeholder="Type something"
      />

      {/* Focus Events */}
      <input
        onFocus={() => setStatus('Focused')}
        onBlur={() => setStatus('Blurred')}
        placeholder="Focus me"
      />

      {/* Form Events */}
      <input
        onChange={(e) => setStatus(`Changed: ${e.target.value}`)}
        placeholder="Type to see change"
      />

      <form onSubmit={(e) => {
        e.preventDefault();
        setStatus('Form Submitted');
      }}>
        <button type="submit">Submit</button>
      </form>

      <p>Status: {status}</p>
    </div>
  );
}
```

### Event Object

```jsx
function EventObjectDemo() {
  const handleEvent = (event) => {
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);
    
    // Prevent default behavior
    event.preventDefault();
    
    // Stop event propagation
    event.stopPropagation();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Input details:', { name, value, type, checked });
  };

  return (
    <div>
      <a href="https://example.com" onClick={handleEvent}>
        Click (won't navigate)
      </a>
      
      <input
        name="username"
        onChange={handleInputChange}
        placeholder="Type something"
      />
    </div>
  );
}
```

### Event Handling Best Practices

```jsx
function BestPractices() {
  const [count, setCount] = useState(0);

  // ✅ Good: Define handler outside JSX
  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  // ✅ Good: Use useCallback for optimization (covered later)
  const handleDecrement = () => {
    setCount(c => c - 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      {/* ✅ Good: Reference to function */}
      <button onClick={handleIncrement}>+</button>
      
      {/* ⚠️ Okay for simple cases */}
      <button onClick={() => setCount(c => c - 1)}>-</button>
      
      {/* ❌ Bad: Creates new function on every render */}
      <button onClick={() => {
        console.log('Doing many things...');
        setCount(c => c + 1);
      }}>
        Complex Operation
      </button>
    </div>
  );
}
```

---

## Controlled vs Uncontrolled Components

### Controlled Components

React controls the form element's value through state.

```jsx
function ControlledInput() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Controlled input"
      />
      <p>You typed: {value}</p>
    </div>
  );
}
```

#### Advantages

- Full control over input value
- Easy to validate in real-time
- Can format/transform input
- Source of truth is React state

```jsx
function ControlledExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    // Convert to lowercase automatically
    setEmail(e.target.value.toLowerCase());
  };

  const handlePasswordChange = (e) => {
    // Limit password length
    if (e.target.value.length <= 20) {
      setPassword(e.target.value);
    }
  };

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email (auto-lowercase)"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password (max 20 chars)"
      />
      <p>Password length: {password.length}/20</p>
    </form>
  );
}
```

### Uncontrolled Components

DOM manages the form element's value; React uses refs to access it.

```jsx
import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input value:', inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        defaultValue="Initial value"
        placeholder="Uncontrolled input"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### When to use uncontrolled

- File inputs (always uncontrolled)
- Integrating with non-React code
- Simple forms where you don't need real-time validation
- Performance optimization for very large forms

### Comparison

```jsx
function ComparisonDemo() {
  // Controlled
  const [controlledValue, setControlledValue] = useState('');
  
  // Uncontrolled
  const uncontrolledRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Controlled:', controlledValue);
    console.log('Uncontrolled:', uncontrolledRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Controlled:</label>
        <input
          value={controlledValue}
          onChange={(e) => setControlledValue(e.target.value)}
        />
        <p>Live value: {controlledValue}</p>
      </div>

      <div>
        <label>Uncontrolled:</label>
        <input
          ref={uncontrolledRef}
          defaultValue=""
        />
        <p>Submit to see value</p>
      </div>

      <button type="submit">Submit Both</button>
    </form>
  );
}
```

---

## Form Handling

### Simple Form

```jsx
function SimpleForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form with Validation

```jsx
function ValidatedForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form is valid!', formData);
      // Submit to API
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <span style={{ color: 'red' }}>{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
```

### Complex Form with Multiple Input Types

```jsx
function ComplexForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    country: '',
    subscribe: false,
    interests: [],
    bio: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxGroup = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Text Input */}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />

      {/* Email Input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      {/* Number Input */}
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />

      {/* Radio Buttons */}
      <div>
        <label>Gender:</label>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="other"
            checked={formData.gender === 'other'}
            onChange={handleChange}
          />
          Other
        </label>
      </div>

      {/* Select Dropdown */}
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
      >
        <option value="">Select Country</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
        <option value="canada">Canada</option>
        <option value="india">India</option>
      </select>

      {/* Checkbox (Single) */}
      <label>
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        Subscribe to newsletter
      </label>

      {/* Checkbox Group */}
      <div>
        <label>Interests:</label>
        <label>
          <input
            type="checkbox"
            value="coding"
            checked={formData.interests.includes('coding')}
            onChange={handleCheckboxGroup}
          />
          Coding
        </label>
        <label>
          <input
            type="checkbox"
            value="design"
            checked={formData.interests.includes('design')}
            onChange={handleCheckboxGroup}
          />
          Design
        </label>
        <label>
          <input
            type="checkbox"
            value="music"
            checked={formData.interests.includes('music')}
            onChange={handleCheckboxGroup}
          />
          Music
        </label>
      </div>

      {/* Textarea */}
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Tell us about yourself"
        rows="4"
      />

      {/* Required Checkbox */}
      <label>
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          required
        />
        I agree to terms and conditions
      </label>

      <button type="submit" disabled={!formData.agreeToTerms}>
        Submit
      </button>
    </form>
  );
}
```

---

## State Updates and Immutability

### Why Immutability Matters

React uses shallow comparison to detect changes. Mutating state directly won't trigger re-renders.

```jsx
// ❌ WRONG - Direct Mutation
function WrongWay() {
  const [user, setUser] = useState({ name: 'John', age: 30 });

  const updateAge = () => {
    user.age = 31; // Direct mutation - React won't detect this!
    setUser(user); // Same reference, no re-render
  };

  return <button onClick={updateAge}>Update Age</button>;
}

// ✅ CORRECT - Immutable Update
function CorrectWay() {
  const [user, setUser] = useState({ name: 'John', age: 30 });

  const updateAge = () => {
    setUser({ ...user, age: 31 }); // New object, triggers re-render
  };

  return <button onClick={updateAge}>Update Age</button>;
}
```

### Updating Objects

```jsx
function ObjectUpdates() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA'
    }
  });

  // Update top-level property
  const updateName = () => {
    setUser(prev => ({
      ...prev,
      name: 'Jane'
    }));
  };

  // Update nested property
  const updateCity = () => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: 'Los Angeles'
      }
    }));
  };

  // Update multiple properties
  const updateMultiple = () => {
    setUser(prev => ({
      ...prev,
      name: 'Bob',
      age: 25
    }));
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>City: {user.address.city}</p>
      
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateCity}>Update City</button>
      <button onClick={updateMultiple}>Update Multiple</button>
    </div>
  );
}
```

### Updating Arrays

```jsx
function ArrayUpdates() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);

  // Add item
  const addItem = () => {
    setItems(prev => [...prev, 'Grape']);
  };

  // Add item at beginning
  const addAtStart = () => {
    setItems(prev => ['Mango', ...prev]);
  };

  // Remove item by index
  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Update item by index
  const updateItem = (index, newValue) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? newValue : item
    ));
  };

  // Insert item at specific position
  const insertAt = (index, value) => {
    setItems(prev => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index)
    ]);
  };

  // Sort items
  const sortItems = () => {
    setItems(prev => [...prev].sort());
  };

  // Reverse items
  const reverseItems = () => {
    setItems(prev => [...prev].reverse());
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>Remove</button>
            <button onClick={() => updateItem(index, 'Updated')}>
              Update
            </button>
          </li>
        ))}
      </ul>
      
      <button onClick={addItem}>Add Item</button>
      <button onClick={addAtStart}>Add at Start</button>
      <button onClick={() => insertAt(2, 'Inserted')}>Insert at 2</button>
      <button onClick={sortItems}>Sort</button>
      <button onClick={reverseItems}>Reverse</button>
    </div>
  );
}
```

### Complex State Updates

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build Project', completed: false }
  ]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodoText = (id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, text: newText }
        : todo
    ));
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
      
      <button onClick={() => addTodo('New Todo')}>Add Todo</button>
    </div>
  );
}
```

---

## Lifting State Up

When multiple components need to share state, move it to their closest common ancestor.

### Basic Example

```jsx
// ❌ Problem: State in wrong place
function TemperatureInput({ scale }) {
  const [temperature, setTemperature] = useState('');
  
  return (
    <input
      value={temperature}
      onChange={(e) => setTemperature(e.target.value)}
    />
  );
}

// Two separate inputs with independent state - can't sync them!
function App() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  );
}
```

```jsx
// ✅ Solution: Lift state up
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <div>
      <label>Temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:</label>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </div>
  );
}

function App() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const handleCelsiusChange = (temp) => {
    setTemperature(temp);
    setScale('c');
  };

  const handleFahrenheitChange = (temp) => {
    setTemperature(temp);
    setScale('f');
  };

  const celsius = scale === 'f' 
    ? ((temperature - 32) * 5/9).toFixed(1)
    : temperature;
    
  const fahrenheit = scale === 'c'
    ? (temperature * 9/5 + 32).toFixed(1)
    : temperature;

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <p>Water will {temperature >= 100 && scale === 'c' ? 'boil' : 'not boil'}</p>
    </div>
  );
}
```

### Real-World Example: Shopping Cart

```jsx
function Product({ product, onAddToCart }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

function ProductList({ products, onAddToCart }) {
  return (
    <div>
      {products.map(product => (
        <Product
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function Cart({ items, onRemoveFromCart }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
                <button onClick={() => onRemoveFromCart(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

function ShoppingApp() {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 }
  ]);

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <ProductList
        products={products}
        onAddToCart={handleAddToCart}
      />
      <Cart
        items={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}
```

---

## State Batching

React automatically batches multiple state updates for better performance.

### Automatic Batching (React 18+)

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  console.log('Render!'); // Will only log once per click

  const handleClick = () => {
    // These are batched - only one re-render
    setCount(c => c + 1);
    setFlag(f => !f);
    // Component re-renders once with both updates
  };

  const handleClickAsync = async () => {
    // Even in async functions, these are batched in React 18+
    await fetch('/api');
    setCount(c => c + 1);
    setFlag(f => !f);
    // Still only one re-render!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Flag: {flag.toString()}</p>
      <button onClick={handleClick}>Update</button>
      <button onClick={handleClickAsync}>Update Async</button>
    </div>
  );
}
```

### Understanding Batching

```jsx
function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  console.log('Component rendered');

  const handleMultipleUpdates = () => {
    console.log('Starting updates...');
    
    // All these updates are batched
    setCount(c => c + 1);
    setText('Updated');
    setItems([1, 2, 3]);
    
    console.log('Updates queued');
    // Component renders once after this function completes
  };

  const handleSequentialReads = () => {
    // Be careful: state updates are asynchronous
    setCount(c => c + 1);
    console.log(count); // Still shows OLD value!
    
    // Use functional update to get latest
    setCount(c => {
      console.log('Latest count:', c + 1);
      return c + 1;
    });
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <p>Items: {items.join(', ')}</p>
      
      <button onClick={handleMultipleUpdates}>
        Multiple Updates (1 render)
      </button>
      <button onClick={handleSequentialReads}>
        Sequential Reads
      </button>
    </div>
  );
}
```

### Opting Out of Batching (Rare Cases)

```jsx
import { flushSync } from 'react-dom';

function FlushSyncExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleClick = () => {
    // Force synchronous update
    flushSync(() => {
      setCount(c => c + 1);
    });
    // count is updated and component has re-rendered
    
    // This will be in a separate render
    setText('Updated');
  };

  // Note: flushSync should be used sparingly
  // Only when you need immediate DOM updates
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
```

---

## Best Practices

### 1. Keep State Minimal

```jsx
// ❌ Bad: Redundant state
function UserProfile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [fullName, setFullName] = useState('John Doe'); // Redundant!

  return <div>{fullName}</div>;
}

// ✅ Good: Derive data from existing state
function UserProfile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  
  const fullName = `${firstName} ${lastName}`; // Calculated

  return <div>{fullName}</div>;
}
```

### 2. Group Related State

```jsx
// ❌ Bad: Too many separate state variables
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  // ... hard to manage
}

// ✅ Good: Group related state
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: ''
  });
  
  // Single update function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
}
```

### 3. Avoid State When Possible

```jsx
// ❌ Bad: Unnecessary state
function FilteredList({ items, searchTerm }) {
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(
      items.filter(item => item.includes(searchTerm))
    );
  }, [items, searchTerm]);

  return <ul>{/* render filteredItems */}</ul>;
}

// ✅ Good: Calculate during render
function FilteredList({ items, searchTerm }) {
  const filteredItems = items.filter(item => 
    item.includes(searchTerm)
  );

  return <ul>{/* render filteredItems */}</ul>;
}
```

### 4. Use Functional Updates

```jsx
// ❌ Risky: Using current state value
const increment = () => {
  setCount(count + 1);
  setCount(count + 1); // Won't work as expected!
};

// ✅ Safe: Using functional update
const increment = () => {
  setCount(c => c + 1);
  setCount(c => c + 1); // Works correctly!
};
```

### 5. Name Event Handlers Consistently

```jsx
function MyComponent() {
  // Use handle* for event handlers
  const handleClick = () => { /* ... */ };
  const handleChange = (e) => { /* ... */ };
  const handleSubmit = (e) => { /* ... */ };
  
  // Use on* for props
  return (
    <ChildComponent
      onClick={handleClick}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
```

---

## Practice Exercises

### Exercise 1: Counter with Multiple Operations

Create a counter that can:

- Increment by 1
- Decrement by 1
- Increment by 5
- Reset to 0
- Set to a custom value

### Exercise 2: Todo List

Build a complete todo list with:

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Filter (all/active/completed)
- Edit todo text
- Show total count

### Exercise 3: Form with Validation

Create a registration form with:

- Username (3-20 characters)
- Email (valid format)
- Password (min 8 chars, 1 uppercase, 1 number)
- Confirm password (must match)
- Real-time validation
- Show error messages
- Disable submit until valid

### Exercise 4: Shopping Cart

Build a shopping cart that:

- Shows list of products
- Add items to cart
- Remove items from cart
- Update quantity
- Calculate total price
- Apply discount codes
- Show cart item count in header

### Exercise 5: Temperature Converter

Create an app that:

- Converts between Celsius, Fahrenheit, and Kelvin
- Updates all fields when one changes
- Shows appropriate warnings (e.g., below absolute zero)
- Formats numbers properly

---

## Summary

### Key Takeaways

1. **useState**: Primary hook for managing component state
2. **Events**: React uses synthetic events with camelCase naming
3. **Controlled Components**: React controls form elements through state
4. **Immutability**: Always create new objects/arrays when updating state
5. **Lifting State**: Move shared state to common ancestor
6. **Batching**: React automatically batches multiple state updates

### Common Pitfalls to Avoid

- ❌ Mutating state directly
- ❌ Using stale state values in updates
- ❌ Forgetting to prevent default on form submit
- ❌ Creating new functions in render for every render
- ❌ Too many individual state variables
- ❌ Not using functional updates when necessary

### Next Steps

- Practice with the exercises above
- Learn about useEffect for side effects
- Explore useReducer for complex state
- Study Context API for global state
- Build real-world projects to solidify concepts

---

## Additional Resources

- [React Official Docs - State](https://react.dev/learn/state-a-components-memory)
- [React Official Docs - Events](https://react.dev/learn/responding-to-events)
- [React Official Docs - Forms](https://react.dev/learn/sharing-state-between-components)

Happy coding! 🚀
