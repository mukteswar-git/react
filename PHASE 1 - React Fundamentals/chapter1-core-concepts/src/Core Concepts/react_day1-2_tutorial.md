# React Core Concepts Tutorial - Day 1-2

## Table of Contents

1. [What is React and Why it Exists](#1-what-is-react-and-why-it-exists)
2. [Virtual DOM Explained](#2-virtual-dom-explained)
3. [JSX Syntax and Rules](#3-jsx-syntax-and-rules)
4. [Components (Functional Components)](#4-components-functional-components)
5. [Props and Prop Drilling](#5-props-and-prop-drilling)
6. [Rendering Lists with .map()](#6-rendering-lists-with-map)
7. [Conditional Rendering](#7-conditional-rendering)
8. [Key Prop Importance](#8-key-prop-importance)

---

## 1. What is React and Why it Exists

### What is React?

React is a **JavaScript library** for building user interfaces (UIs), particularly single-page applications where you need a fast, interactive user experience.

**Key Points:**

- Created by Facebook (Meta) in 2013
- It's a **library**, not a framework (unlike Angular)
- Focuses on the **View** layer (the UI)
- Component-based architecture
- Declarative (you describe what you want, React handles how)

### Why Does React Exist?

**Problem Without React:**

```javascript
// Vanilla JavaScript - Manually managing DOM
const app = document.getElementById('app');
let count = 0;

function updateUI() {
  app.innerHTML = `
    <div>
      <h1>Count: ${count}</h1>
      <button onclick="increment()">+</button>
    </div>
  `;
}

function increment() {
  count++;
  updateUI(); // Have to manually update
}

updateUI();
```

**Problems:**

- Manual DOM manipulation is tedious
- Hard to track what changed
- Performance issues (re-rendering everything)
- Code becomes messy as app grows
- Hard to maintain state

**Solution With React:**

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**Benefits:**

- Declarative - describe UI based on state
- Automatic UI updates when state changes
- Better performance with Virtual DOM
- Reusable components
- Easy to maintain and scale

### Why React is Popular

1. **Component Reusability** - Build once, use everywhere
2. **Virtual DOM** - Fast updates
3. **Large Ecosystem** - Tons of libraries
4. **Strong Community** - Lots of resources
5. **Job Market** - High demand for React developers
6. **Backed by Meta** - Stable and well-maintained

---

## 2. Virtual DOM Explained

### What is the DOM?

**DOM (Document Object Model)** = Tree structure representing your HTML

```html
<!-- HTML -->
<div id="app">
  <h1>Hello</h1>
  <p>World</p>
</div>
```

```text
DOM Tree:
    div#app
    ├── h1 ("Hello")
    └── p ("World")
```

### The Problem with Real DOM

**Real DOM is SLOW** when you make changes:

```javascript
// Every change triggers:
// 1. Browser recalculates styles
// 2. Browser reflows layout
// 3. Browser repaints pixels

document.querySelector('h1').textContent = 'New Title'; // Slow!
document.querySelector('p').textContent = 'New Text';   // Slow!
document.querySelector('button').style.color = 'red';   // Slow!
```

### What is Virtual DOM?

**Virtual DOM** = Lightweight JavaScript copy of the real DOM

```javascript
// Virtual DOM is just a JavaScript object
const virtualDOM = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', props: {}, children: ['Hello'] },
    { type: 'p', props: {}, children: ['World'] }
  ]
};
```

### How Virtual DOM Works

**Step-by-step Process:**

```text
1. State changes in React
   ↓
2. React creates NEW Virtual DOM tree
   ↓
3. React COMPARES new vs old Virtual DOM (Diffing)
   ↓
4. React finds MINIMAL changes needed
   ↓
5. React updates ONLY those parts in Real DOM (Reconciliation)
```

**Example:**

```javascript
// You change one word
function App() {
  const [text, setText] = useState('Hello');
  
  return (
    <div>
      <h1>{text}</h1>
      <p>This is a paragraph</p>
      <button onClick={() => setText('Hi')}>Change</button>
    </div>
  );
}

// Without Virtual DOM:
// - Entire <div> would re-render
// - All children would update

// With Virtual DOM:
// - React sees only <h1> text changed
// - Updates ONLY the text node
// - <p> and <button> stay untouched
```

### Virtual DOM Benefits

1. **Batching** - Groups multiple updates together
2. **Minimal Updates** - Only changes what's needed
3. **Fast** - JavaScript operations are faster than DOM
4. **Cross-platform** - Same concept works for mobile (React Native)

**Visual Example:**

```javascript
// You click button 3 times rapidly
<button onClick={() => setCount(count + 1)}>+</button>

// Without Virtual DOM:
// Update 1: Real DOM updated
// Update 2: Real DOM updated  
// Update 3: Real DOM updated
// = 3 expensive DOM operations

// With Virtual DOM:
// Update 1: Virtual DOM changed
// Update 2: Virtual DOM changed
// Update 3: Virtual DOM changed
// React batches all 3 → ONE Real DOM update
// = 1 efficient DOM operation
```

---

## 3. JSX Syntax and Rules

### What is JSX?

### JSX = JavaScript XML

It looks like HTML but it's actually JavaScript:

```javascript
// This JSX:
const element = <h1>Hello World</h1>;

// Gets transformed to this JavaScript:
const element = React.createElement('h1', null, 'Hello World');
```

### JSX Basic Syntax

#### 1. JavaScript Expressions in JSX

Use `{}` to embed JavaScript:

```javascript
function Greeting() {
  const name = 'John';
  const age = 25;
  
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Age: {age}</p>
      <p>Next year: {age + 1}</p>
      <p>Uppercase: {name.toUpperCase()}</p>
    </div>
  );
}
```

#### 2. Attributes in JSX

```javascript
function Image() {
  const imageUrl = 'https://example.com/image.jpg';
  const altText = 'Description';
  
  return (
    <img 
      src={imageUrl} 
      alt={altText}
      className="profile-pic"  // NOT "class"
      style={{ width: '100px', border: '1px solid black' }}
    />
  );
}
```

#### 3. Self-Closing Tags

```javascript
// HTML allows: <img src="...">
// JSX requires: <img src="..." />

function Icons() {
  return (
    <div>
      <img src="icon.png" />
      <br />
      <input type="text" />
      <hr />
    </div>
  );
}
```

### JSX Rules (IMPORTANT!)

#### Rule 1: Return ONE Parent Element

```javascript
// ❌ WRONG - Multiple root elements
function Wrong() {
  return (
    <h1>Title</h1>
    <p>Text</p>
  );
}

// ✅ CORRECT - Wrapped in parent
function Correct() {
  return (
    <div>
      <h1>Title</h1>
      <p>Text</p>
    </div>
  );
}

// ✅ CORRECT - Using Fragment (no extra DOM node)
function BetterCorrect() {
  return (
    <>
      <h1>Title</h1>
      <p>Text</p>
    </>
  );
}
```

#### Rule 2: Use `className` not `class`

```javascript
// ❌ WRONG
<div class="container">Content</div>

// ✅ CORRECT
<div className="container">Content</div>

// Why? "class" is a reserved JavaScript keyword
```

#### Rule 3: Use `htmlFor` not `for`

```javascript
// ❌ WRONG
<label for="name">Name:</label>

// ✅ CORRECT
<label htmlFor="name">Name:</label>
```

#### Rule 4: Close All Tags

```javascript
// ❌ WRONG
<img src="pic.jpg">
<input type="text">

// ✅ CORRECT
<img src="pic.jpg" />
<input type="text" />
```

#### Rule 5: camelCase for Event Handlers

```javascript
// ❌ WRONG
<button onclick="handleClick()">Click</button>

// ✅ CORRECT
<button onClick={handleClick}>Click</button>

// Common events:
// onclick → onClick
// onchange → onChange
// onsubmit → onSubmit
// onkeydown → onKeyDown
```

#### Rule 6: Inline Styles as Objects

```javascript
// ❌ WRONG
<div style="color: red; font-size: 20px">Text</div>

// ✅ CORRECT
<div style={{ color: 'red', fontSize: '20px' }}>Text</div>

// Note: CSS properties become camelCase
// font-size → fontSize
// background-color → backgroundColor
```

#### Rule 7: Comments in JSX

```javascript
function Example() {
  return (
    <div>
      {/* This is a comment */}
      <h1>Hello</h1>
      
      {/* 
        Multi-line
        comment
      */}
      <p>Text</p>
    </div>
  );
}
```

### JSX vs HTML Differences

| HTML | JSX | Reason |
| ------ | ----- | -------- |
| `class` | `className` | "class" is JS keyword |
| `for` | `htmlFor` | "for" is JS keyword |
| `onclick` | `onClick` | React uses camelCase |
| `style="..."` | `style={{...}}` | Styles are objects |
| `<img>` | `<img />` | Must self-close |
| `tabindex` | `tabIndex` | camelCase convention |

### Practical JSX Examples

```javascript
function UserProfile() {
  const user = {
    name: 'Alice',
    age: 28,
    email: 'alice@example.com',
    isOnline: true
  };
  
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f0f0f0'
    },
    title: {
      color: user.isOnline ? 'green' : 'gray',
      fontSize: '24px'
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{user.name}</h1>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <p>Status: {user.isOnline ? 'Online' : 'Offline'}</p>
      
      {/* Button with event handler */}
      <button onClick={() => alert(`Hello ${user.name}!`)}>
        Greet User
      </button>
    </div>
  );
}
```

---

## 4. Components (Functional Components)

### What is a Component?

**Component** = Reusable piece of UI (like a function that returns JSX)

Think of components as **LEGO blocks** - you build complex UIs by combining simple pieces.

### Functional Component Syntax

```javascript
// Basic component
function Welcome() {
  return <h1>Hello World</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Hello World</h1>;
};

// Implicit return (no curly braces needed for single expression)
const Welcome = () => <h1>Hello World</h1>;
```

### Component Rules

#### Rule 1: Name Must Start with Capital Letter

```javascript
// ❌ WRONG - lowercase
function welcome() {
  return <h1>Hello</h1>;
}

// ✅ CORRECT - PascalCase
function Welcome() {
  return <h1>Hello</h1>;
}

// Why? React treats lowercase as HTML tags
<div>   // HTML element
<Welcome>  // React component
```

#### Rule 2: Must Return JSX

```javascript
// ❌ WRONG - No return
function Wrong() {
  <h1>Hello</h1>
}

// ✅ CORRECT
function Correct() {
  return <h1>Hello</h1>;
}
```

#### Rule 3: One Component Per File (Best Practice)

```javascript
// Welcome.jsx
function Welcome() {
  return <h1>Hello</h1>;
}

export default Welcome;
```

### Using Components

```javascript
// Define components
function Header() {
  return <h1>My Website</h1>;
}

function Sidebar() {
  return <aside>Sidebar content</aside>;
}

function Footer() {
  return <footer>© 2024</footer>;
}

// Use components
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <Footer />
    </div>
  );
}
```

### Nesting Components

```javascript
function UserInfo() {
  return (
    <div>
      <h2>John Doe</h2>
      <p>Developer</p>
    </div>
  );
}

function UserAvatar() {
  return <img src="avatar.jpg" alt="User" />;
}

// Nesting
function UserCard() {
  return (
    <div className="card">
      <UserAvatar />
      <UserInfo />
    </div>
  );
}
```

### Component Composition

Build complex UIs from simple components:

```javascript
// Atomic components
function Button({ text }) {
  return <button>{text}</button>;
}

function Input({ placeholder }) {
  return <input placeholder={placeholder} />;
}

// Composite component
function LoginForm() {
  return (
    <form>
      <h2>Login</h2>
      <Input placeholder="Username" />
      <Input placeholder="Password" />
      <Button text="Login" />
    </form>
  );
}

// Page component
function LoginPage() {
  return (
    <div className="page">
      <header>My App</header>
      <LoginForm />
      <footer>Help | Privacy</footer>
    </div>
  );
}
```

### Real-World Example

```javascript
// Product.jsx
function Product() {
  const product = {
    name: 'Laptop',
    price: 999,
    image: 'laptop.jpg',
    inStock: true
  };
  
  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      <button>Add to Cart</button>
    </div>
  );
}

export default Product;
```

```javascript
// App.jsx
import Product from './Product';

function App() {
  return (
    <div className="app">
      <h1>Products</h1>
      <Product />
      <Product />
      <Product />
    </div>
  );
}

export default App;
```

---

## 5. Props and Prop Drilling

### What are Props?

**Props (Properties)** = Data passed from parent component to child component

Think of props like **function arguments** for components.

### Basic Props Usage

```javascript
// Child component receives props
function Greeting(props) {
  return <h1>Hello {props.name}!</h1>;
}

// Parent component sends props
function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}

// Output:
// Hello Alice!
// Hello Bob!
// Hello Charlie!
```

### Props Destructuring (Recommended)

```javascript
// Instead of: function Greeting(props)
// Use destructuring:

function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Usage
<Greeting name="Alice" age={25} />
```

### Props Types

```javascript
function Example({ text, number, boolean, array, object, func }) {
  return (
    <div>
      <p>Text: {text}</p>
      <p>Number: {number}</p>
      <p>Boolean: {boolean ? 'Yes' : 'No'}</p>
      <p>First item: {array[0]}</p>
      <p>City: {object.city}</p>
      <button onClick={func}>Click</button>
    </div>
  );
}

// Usage
<Example 
  text="Hello"
  number={42}
  boolean={true}
  array={[1, 2, 3]}
  object={{ city: 'NYC', country: 'USA' }}
  func={() => alert('Clicked!')}
/>
```

### Props are Read-Only (Immutable)

```javascript
function Button({ label }) {
  // ❌ WRONG - Cannot modify props
  label = 'New Label';  // Error!
  
  // ✅ CORRECT - Props are read-only
  return <button>{label}</button>;
}
```

### Default Props

```javascript
function Greeting({ name = 'Guest', age = 0 }) {
  return (
    <div>
      <h1>Hello {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Usage
<Greeting />  // Hello Guest! Age: 0
<Greeting name="Alice" />  // Hello Alice! Age: 0
<Greeting name="Bob" age={30} />  // Hello Bob! Age: 30
```

### Children Prop

Special prop for content between tags:

```javascript
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage
function App() {
  return (
    <Card>
      <h2>Title</h2>
      <p>This is the content inside the card</p>
    </Card>
  );
}
```

### Practical Props Example

```javascript
function ProductCard({ image, name, price, inStock, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">${price}</p>
      <p className={inStock ? 'in-stock' : 'out-of-stock'}>
        {inStock ? 'Available' : 'Sold Out'}
      </p>
      <button 
        onClick={onAddToCart} 
        disabled={!inStock}
      >
        Add to Cart
      </button>
    </div>
  );
}

// Usage
function ProductList() {
  const handleAddToCart = (productName) => {
    alert(`Added ${productName} to cart`);
  };
  
  return (
    <div>
      <ProductCard 
        image="laptop.jpg"
        name="Laptop"
        price={999}
        inStock={true}
        onAddToCart={() => handleAddToCart('Laptop')}
      />
      
      <ProductCard 
        image="phone.jpg"
        name="Phone"
        price={699}
        inStock={false}
        onAddToCart={() => handleAddToCart('Phone')}
      />
    </div>
  );
}
```

### What is Prop Drilling?

**Prop Drilling** = Passing props through multiple levels of components

```javascript
// Deep component needs data from top
function Grandparent() {
  const user = { name: 'Alice', role: 'Admin' };
  
  return <Parent user={user} />;
}

function Parent({ user }) {
  // Parent doesn't use 'user', just passes it down
  return <Child user={user} />;
}

function Child({ user }) {
  // Child doesn't use 'user', just passes it down
  return <Grandchild user={user} />;
}

function Grandchild({ user }) {
  // Finally used here!
  return <p>Hello {user.name}, you are {user.role}</p>;
}
```

### Prop Drilling Problems

```javascript
// Real-world prop drilling nightmare

function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState({ name: 'Alice' });
  
  return (
    <Layout theme={theme} language={language} user={user}>
      <Navbar theme={theme} language={language} user={user}>
        <UserMenu theme={theme} user={user}>
          <UserDropdown theme={theme} user={user}>
            <UserProfile user={user} />  {/* Finally used! */}
          </UserDropdown>
        </UserMenu>
      </Navbar>
    </Layout>
  );
}

// Problems:
// 1. Tedious to pass props through every level
// 2. Hard to maintain
// 3. Components become coupled
// 4. Refactoring is painful
```

### Prop Drilling Solutions (Preview)

```javascript
// Solution 1: Component Composition
function App() {
  const user = { name: 'Alice' };
  
  return (
    <Layout>
      <Navbar>
        <UserProfile user={user} />  {/* Direct! */}
      </Navbar>
    </Layout>
  );
}

// Solution 2: Context API (You'll learn in Week 3)
// Solution 3: State Management (Redux/Zustand - Week 3)
```

### Props Best Practices

```javascript
// ✅ DO: Destructure props
function Good({ name, age }) {
  return <p>{name} is {age}</p>;
}

// ❌ DON'T: Use props object everywhere
function Bad(props) {
  return <p>{props.name} is {props.age}</p>;
}

// ✅ DO: Use default values
function Button({ label = 'Click Me', type = 'button' }) {
  return <button type={type}>{label}</button>;
}

// ✅ DO: Spread props when needed
function Input(props) {
  return <input className="custom-input" {...props} />;
}
// Usage: <Input type="text" placeholder="Name" />

// ✅ DO: Keep prop names clear and consistent
<ProductCard 
  productName="Laptop"  // Clear
  productPrice={999}    // Clear
/>

// ❌ DON'T: Use unclear names
<ProductCard 
  name="Laptop"   // Ambiguous - product name or user name?
  price={999}     // OK
/>
```

---

## 6. Rendering Lists with .map()

### Why Use .map()?

In React, you often need to display arrays of data as UI elements.

```javascript
// Bad way - repetitive
function ProductList() {
  return (
    <div>
      <div>Product 1</div>
      <div>Product 2</div>
      <div>Product 3</div>
      {/* What if you have 100 products? */}
    </div>
  );
}

// Good way - dynamic with .map()
function ProductList() {
  const products = ['Product 1', 'Product 2', 'Product 3'];
  
  return (
    <div>
      {products.map((product) => (
        <div>{product}</div>
      ))}
    </div>
  );
}
```

### Basic .map() Syntax

```javascript
function NameList() {
  const names = ['Alice', 'Bob', 'Charlie'];
  
  return (
    <ul>
      {names.map((name) => (
        <li>{name}</li>
      ))}
    </ul>
  );
}

// Output:
// • Alice
// • Bob
// • Charlie
```

### .map() with Objects

```javascript
function UserList() {
  const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ];
  
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
}
```

### .map() with Components

```javascript
function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
}

function ProductList() {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Tablet', price: 499 }
  ];
  
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  );
}
```

### .map() with Index

```javascript
function NumberedList() {
  const items = ['First', 'Second', 'Third'];
  
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index}>
          Item #{index + 1}: {item}
        </li>
      ))}
    </ol>
  );
}

// Output:
// 1. Item #1: First
// 2. Item #2: Second
// 3. Item #3: Third
```

### Filtering Before Mapping

```javascript
function ProductList() {
  const products = [
    { id: 1, name: 'Laptop', price: 999, inStock: true },
    { id: 2, name: 'Phone', price: 699, inStock: false },
    { id: 3, name: 'Tablet', price: 499, inStock: true }
  ];
  
  return (
    <div>
      <h2>Available Products</h2>
      {products
        .filter(product => product.inStock)  // Filter first
        .map(product => (                     // Then map
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))
      }
    </div>
  );
}

// Only shows Laptop and Tablet (in stock)
```

### Nested .map()

```javascript
function CategoryList() {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      products: ['Laptop', 'Phone', 'Tablet']
    },
    {
      id: 2,
      name: 'Clothing',
      products: ['Shirt', 'Pants', 'Shoes']
    }
  ];
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Common .map() Mistakes

```javascript
// ❌ WRONG - Missing return
{products.map(product => {
  <div>{product.name}</div>  // Missing return!
})}

// ✅ CORRECT - Implicit return with ()
{products.map(product => (
  <div>{product.name}</div>
))}

// ✅ CORRECT - Explicit return
{products.map(product => {
  return <div>{product.name}</div>;
})}

// ❌ WRONG - Missing key prop (see next section)
{products.map(product => (
  <div>{product.name}</div>
))}

// ✅ CORRECT - With key
{products.map(product => (
  <div key={product.id}>{product.name}</div>
))}
```

### Real-World Example (.map())

```javascript
function TodoList() {
  const todos = [
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Walk the dog', completed: true },
    { id: 3, text: 'Write code', completed: false }
  ];
  
  return (
    <div className="todo-list">
      <h1>My Todos</h1>
      {todos.map(todo => (
        <div 
          key={todo.id} 
          className={todo.completed ? 'completed' : 'pending'}
        >
          <input type="checkbox" checked={todo.completed} />
          <span>{todo.text}</span>
        </div>
      ))}
      
      <p>
        Completed: {todos.filter(t => t.completed).length} / {todos.length}
      </p>
    </div>
  );
}
```

---

## 7. Conditional Rendering

### What is Conditional Rendering?

Showing different UI based on conditions (like if-else for JSX).

### Method 1: if-else (Outside JSX)

```javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign in</h1>;
  }
}

// Usage
<Greeting isLoggedIn={true} />   // Welcome back!
<Greeting isLoggedIn={false} />  // Please sign in
```

### Method 2: Ternary Operator (Inside JSX)

```javascript
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}
```

### Method 3: Logical && (Show or Nothing)

```javascript
function Notification({ hasMessages }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {hasMessages && <p>You have new messages!</p>}
    </div>
  );
}

// Usage
<Notification hasMessages={true} />   // Shows message
<Notification hasMessages={false} />  // No message shown
```

### When to Use Each Method

```javascript
// Use if-else: Early returns, complex logic
function UserDashboard({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  if (user.role === 'admin') {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
}

// Use ternary: Simple two-way choice
function Status({ isOnline }) {
  return <span>{isOnline ? 'Online' : 'Offline'}</span>;
}

// Use &&: Show element or nothing
function ErrorMessage({ error }) {
  return (
    <div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Multiple Conditions with Ternary

```javascript
function UserBadge({ status }) {
  return (
    <div className={
      status === 'online' ? 'badge-green' :
      status === 'away' ? 'badge-yellow' :
      status === 'offline' ? 'badge-gray' :
      'badge-default'
    }>
      {status}
    </div>
  );
}
```

### Conditional Class Names

```javascript
function Button({ isPrimary, isDisabled }) {
  return (
    <button 
      className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'} ${isDisabled ? 'disabled' : ''}`}
      disabled={isDisabled}
    >
      Click Me
    </button>
  );
}
```

### Conditional Styles

```javascript
function Alert({ type, message }) {
  const alertStyles = {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: type === 'error' ? '#ffcccc' : 
                     type === 'success' ? '#ccffcc' : 
                     type === 'warning' ? '#ffffcc' : '#e0e0e0',
    color: type === 'error' ? '#cc0000' : 
           type === 'success' ? '#00cc00' : 
           type === 'warning' ? '#cccc00' : '#333'
  };
  
  return <div style={alertStyles}>{message}</div>;
}
```

### Complex Conditional Rendering

```javascript
function ProductCard({ product }) {
  // Multiple conditions
  const showDiscount = product.discount > 0;
  const isOutOfStock = product.stock === 0;
  const isFeatured = product.rating >= 4.5;
  
  return (
    <div className="product-card">
      {isFeatured && <span className="badge">⭐ Featured</span>}
      
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      
      <div className="price">
        {showDiscount ? (
          <>
            <span className="original-price">${product.price}</span>
            <span className="discount-price">
              ${product.price - product.discount}
            </span>
          </>
        ) : (
          <span>${product.price}</span>
        )}
      </div>
      
      {isOutOfStock ? (
        <button disabled>Out of Stock</button>
      ) : (
        <button>Add to Cart</button>
      )}
      
      {product.stock < 5 && product.stock > 0 && (
        <p className="warning">Only {product.stock} left!</p>
      )}
    </div>
  );
}
```

### Null/Undefined Handling

```javascript
function UserProfile({ user }) {
  // Early return if no user
  if (!user) {
    return <div>No user data available</div>;
  }
  
  return (
    <div>
      <h2>{user.name}</h2>
      {/* Optional chaining */}
      <p>{user.address?.city || 'City not provided'}</p>
      
      {/* Conditional rendering with nullish coalescing */}
      <p>Age: {user.age ?? 'Not specified'}</p>
    </div>
  );
}
```

### Rendering Nothing

```javascript
function ConditionalComponent({ shouldShow, children }) {
  // Don't render anything if shouldShow is false
  if (!shouldShow) {
    return null;  // Returns nothing, component won't appear
  }
  
  return <div>{children}</div>;
}

// Usage
<ConditionalComponent shouldShow={false}>
  This won't be rendered
</ConditionalComponent>
```

### Switch Statement Alternative

```javascript
function UserRole({ role }) {
  const renderRole = () => {
    switch(role) {
      case 'admin':
        return <AdminPanel />;
      case 'moderator':
        return <ModeratorPanel />;
      case 'user':
        return <UserPanel />;
      default:
        return <GuestPanel />;
    }
  };
  
  return <div>{renderRole()}</div>;
}
```

### Conditional Rendering Best Practices

```javascript
// ✅ DO: Keep conditions simple and readable
function Good({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
}

// ❌ DON'T: Nest too many ternaries
function Bad({ status }) {
  return (
    <div>
      {status === 'loading' ? <Spinner /> : 
       status === 'error' ? <Error /> : 
       status === 'empty' ? <Empty /> : 
       status === 'success' ? <Data /> : null}
    </div>
  );
}

// ✅ DO: Use early returns for complex logic
function Better({ status }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  if (status === 'empty') return <Empty />;
  
  return <Data />;
}

// ✅ DO: Extract complex conditions to variables
function UserCard({ user }) {
  const isPremium = user.subscription === 'premium';
  const hasVerifiedEmail = user.emailVerified;
  const canAccessFeature = isPremium && hasVerifiedEmail;
  
  return (
    <div>
      <h2>{user.name}</h2>
      {canAccessFeature && <PremiumFeature />}
    </div>
  );
}
```

### Real-World Example: Authentication UI

```javascript
function App({ user, isLoading, error }) {
  // Loading state
  if (isLoading) {
    return (
      <div className="loading">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  // Success state - show different UI based on user
  return (
    <div className="app">
      <header>
        <h1>My App</h1>
        {user ? (
          <div className="user-menu">
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
            <button>Logout</button>
          </div>
        ) : (
          <button>Login</button>
        )}
      </header>
      
      <main>
        {user ? (
          <>
            <h2>Welcome back, {user.name}!</h2>
            {user.isPremium && <PremiumBanner />}
            <Dashboard />
          </>
        ) : (
          <>
            <h2>Welcome to My App</h2>
            <p>Please log in to continue</p>
            <LoginForm />
          </>
        )}
      </main>
    </div>
  );
}
```

---

## 8. Key Prop Importance

### What is the Key Prop?

**Key** = Unique identifier for list items to help React track which items changed, added, or removed.

### Why Keys are Important

```javascript
// Without keys - React's confusion
function TodoList() {
  const todos = ['Buy milk', 'Walk dog', 'Code'];
  
  return (
    <ul>
      {todos.map(todo => (
        <li>{todo}</li>  // ⚠️ Warning: Each child should have a unique "key" prop
      ))}
    </ul>
  );
}

// What happens when you add an item at the start?
// Before: ['Buy milk', 'Walk dog', 'Code']
// After:  ['Exercise', 'Buy milk', 'Walk dog', 'Code']

// Without keys, React thinks:
// - Item 0 changed from "Buy milk" to "Exercise"
// - Item 1 changed from "Walk dog" to "Buy milk"
// - Item 2 changed from "Code" to "Walk dog"
// - Item 3 is new "Code"
// = React re-renders ALL items (inefficient!)

// With keys, React knows:
// - Item with key "Exercise" is new
// - All other items stayed the same
// = React only adds ONE new item (efficient!)
```

### Adding Keys Correctly

```javascript
function TodoList() {
  const todos = [
    { id: 1, text: 'Buy milk' },
    { id: 2, text: 'Walk dog' },
    { id: 3, text: 'Code' }
  ];
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>  // ✅ Correct
      ))}
    </ul>
  );
}
```

### Key Rules

#### Rule 1: Keys Must Be Unique Among Siblings

```javascript
// ✅ CORRECT - Unique IDs
function GoodList() {
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' }
  ];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ❌ WRONG - Duplicate keys
function BadList() {
  const items = [
    { id: 1, name: 'Apple' },
    { id: 1, name: 'Banana' },  // Same ID!
    { id: 1, name: 'Cherry' }   // Same ID!
  ];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>  // ⚠️ Warning!
      ))}
    </ul>
  );
}
```

#### Rule 2: Keys Must Be Stable (Not Change)

```javascript
// ❌ WRONG - Using Math.random()
function BadList() {
  const items = ['Apple', 'Banana', 'Cherry'];
  
  return (
    <ul>
      {items.map(item => (
        <li key={Math.random()}>{item}</li>  // New key on every render!
      ))}
    </ul>
  );
}

// ✅ CORRECT - Stable unique ID
function GoodList() {
  const items = [
    { id: 'apple-1', name: 'Apple' },
    { id: 'banana-2', name: 'Banana' },
    { id: 'cherry-3', name: 'Cherry' }
  ];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

#### Rule 3: Don't Use Index as Key (Unless No Other Option)

```javascript
// ⚠️ AVOID - Using index as key
function AvoidThis() {
  const items = ['Apple', 'Banana', 'Cherry'];
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>  // Works, but problematic
      ))}
    </ul>
  );
}

// Why it's bad:
// Original: [0: Apple, 1: Banana, 2: Cherry]
// After removing Banana: [0: Apple, 1: Cherry]
// React thinks: Item 1 changed from Banana to Cherry
// Reality: Item 1 (Banana) was removed, Cherry is still item 2
```

### When Index as Key is OK

```javascript
// ✅ OK to use index when:
// 1. List is static (never changes)
// 2. Items have no IDs
// 3. List is never reordered/filtered

function StaticList() {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <ul>
      {daysOfWeek.map((day, index) => (
        <li key={index}>{day}</li>  // OK - list never changes
      ))}
    </ul>
  );
}
```

### Key Problems Demonstrated

```javascript
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'First', done: false },
    { id: 2, text: 'Second', done: false },
    { id: 3, text: 'Third', done: false }
  ]);
  
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      {/* ❌ WRONG - Using index */}
      <h3>With Index (BROKEN):</h3>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <input type="checkbox" />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {/* ✅ CORRECT - Using ID */}
      <h3>With ID (WORKS):</h3>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Try this:
// 1. Check the checkbox for "Second"
// 2. Delete "First"
// 
// With index key: Wrong checkbox is checked!
// With ID key: Correct checkbox stays checked
```

### Generating Unique Keys

```javascript
// Option 1: Use database IDs (best)
const users = [
  { id: 101, name: 'Alice' },  // ID from database
  { id: 102, name: 'Bob' }
];

// Option 2: Use UUID library
import { v4 as uuidv4 } from 'uuid';

const addTodo = (text) => {
  const newTodo = {
    id: uuidv4(),  // Generates: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    text: text
  };
  setTodos([...todos, newTodo]);
};

// Option 3: Use Date.now() + random (simple)
const generateId = () => {
  return `${Date.now()}-${Math.random()}`;
};

// Option 4: Combine properties (if unique together)
const books = [
  { isbn: '978-0-123456-78-9', title: 'Book 1' },
  { isbn: '978-0-987654-32-1', title: 'Book 2' }
];

books.map(book => (
  <div key={book.isbn}>{book.title}</div>
));
```

### Keys in Fragments

```javascript
function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        // Use React.Fragment when you need to add key to fragment
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

### Keys Don't Get Passed as Props

```javascript
function ListItem({ id, name }) {
  // Key prop is NOT accessible inside component
  // You won't receive 'key' in props
  console.log(id);  // ✅ This works
  console.log(key); // ❌ Undefined - key is special
  
  return <li>{name}</li>;
}

function List() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  
  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id}    // For React's internal use
          id={item.id}     // Passed as prop
          name={item.name}
        />
      ))}
    </ul>
  );
}
```

### Real-World Examples

#### Example 1: Shopping Cart

```javascript
function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 'prod-1', name: 'Laptop', price: 999, quantity: 1 },
    { id: 'prod-2', name: 'Mouse', price: 29, quantity: 2 },
    { id: 'prod-3', name: 'Keyboard', price: 79, quantity: 1 }
  ]);
  
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Total: ${item.price * item.quantity}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Example 2: Comments Thread

```javascript
function CommentSection() {
  const comments = [
    { 
      id: 'comment-1', 
      author: 'Alice', 
      text: 'Great post!',
      replies: [
        { id: 'reply-1-1', author: 'Bob', text: 'Thanks!' }
      ]
    },
    { 
      id: 'comment-2', 
      author: 'Charlie', 
      text: 'Very helpful',
      replies: []
    }
  ];
  
  return (
    <div className="comments">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>
          
          {/* Nested list also needs keys */}
          {comment.replies.length > 0 && (
            <div className="replies">
              {comment.replies.map(reply => (
                <div key={reply.id} className="reply">
                  <strong>{reply.author}</strong>
                  <p>{reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### Example 3: Filtered List

```javascript
function ProductList() {
  const [products] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Shirt', category: 'Clothing', price: 29 },
    { id: 3, name: 'Phone', category: 'Electronics', price: 699 },
    { id: 4, name: 'Shoes', category: 'Clothing', price: 89 }
  ]);
  
  const [filter, setFilter] = useState('All');
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);
  
  return (
    <div>
      <div>
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Electronics')}>Electronics</button>
        <button onClick={() => setFilter('Clothing')}>Clothing</button>
      </div>
      
      {/* Keys remain stable even when filtering */}
      <div className="products">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Key Takeaways

```javascript
// ✅ DO: Use unique, stable IDs
<li key={user.id}>{user.name}</li>

// ✅ DO: Use string IDs if necessary
<li key={`user-${user.email}`}>{user.name}</li>

// ✅ DO: Use index ONLY for static lists
const days = ['Mon', 'Tue', 'Wed'];
days.map((day, i) => <li key={i}>{day}</li>)

// ❌ DON'T: Use index for dynamic lists
todos.map((todo, i) => <li key={i}>{todo}</li>)

// ❌ DON'T: Use random values
<li key={Math.random()}>{item}</li>

// ❌ DON'T: Use non-unique values
<li key={user.role}>{user.name}</li>  // Multiple users can have same role!

// ❌ DON'T: Forget keys in lists
{items.map(item => <li>{item}</li>)}  // Warning!
```

---

## 🎯 Practice Exercises

### Exercise 1: Simple Product Card

Create a component that displays product information:

```javascript
// Your task: Complete this component
function ProductCard() {
  const product = {
    name: 'Wireless Headphones',
    price: 79.99,
    image: 'headphones.jpg',
    inStock: true,
    rating: 4.5
  };
  
  // TODO: 
  // 1. Display product image
  // 2. Show name and price
  // 3. Show "In Stock" or "Out of Stock"
  // 4. Show rating with stars
  // 5. Add "Add to Cart" button
  
  return (
    // Your code here
  );
}
```

### Exercise 2: User List with Conditional Rendering

```javascript
// Your task: Display list of users with conditional badges
function UserList() {
  const users = [
    { id: 1, name: 'Alice', role: 'admin', isOnline: true },
    { id: 2, name: 'Bob', role: 'user', isOnline: false },
    { id: 3, name: 'Charlie', role: 'moderator', isOnline: true }
  ];
  
  // TODO:
  // 1. Map through users
  // 2. Show green dot if online, gray if offline
  // 3. Show role badge with different colors
  // 4. Use proper keys
  
  return (
    // Your code here
  );
}
```

### Exercise 3: Todo List with Filter

```javascript
// Your task: Create a filterable todo list
function TodoApp() {
  const todos = [
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ];
  
  // TODO:
  // 1. Show all todos
  // 2. Add filter buttons (All, Active, Completed)
  // 3. Conditionally show todos based on filter
  // 4. Show checkbox for each todo
  // 5. Display completed count
  
  return (
    // Your code here
  );
}
```

---

## 📝 Summary Checklist

After completing Day 1-2, you should be able to:

- [ ] Explain what React is and why we use it
- [ ] Understand how Virtual DOM improves performance
- [ ] Write valid JSX following all syntax rules
- [ ] Create functional components with proper naming
- [ ] Pass and receive props between components
- [ ] Understand prop drilling and its limitations
- [ ] Render lists using .map() method
- [ ] Filter and transform data before rendering
- [ ] Use conditional rendering (if/else, ternary, &&)
- [ ] Add proper key props to list items
- [ ] Explain why keys are important for performance

---

## 🚀 Next Steps

**Day 3-4:** State & Events

- useState hook
- Event handling
- Forms and controlled components
- Updating state immutably

**Day 5-7:** Side Effects

- useEffect hook
- Data fetching
- Cleanup functions
- API integration

---

## 💡 Additional Resources

**Official Documentation:**

- **React Docs**: [Official React documentation](https://react.dev)
- **JSX Introduction**: [Writing markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- **Lists and Keys**: [Rendering lists in React](https://react.dev/learn/rendering-lists)

**Practice:**

- Build a product catalog
- Create a user profile card
- Make a filterable table
- Build a simple blog layout

**Common Mistakes to Avoid:**

- Forgetting to capitalize component names
- Missing return statement in components
- Using `class` instead of `className`
- Forgetting keys in lists
- Using index as key for dynamic lists
- Modifying props directly

---

**Ready to move forward?** Make sure you practice with the exercises above before moving to state management in Day 3-4!
