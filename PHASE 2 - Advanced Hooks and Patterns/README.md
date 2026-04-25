# 🚀 Phase 2: Advanced Hooks & Patterns

This phase focuses on **performance, reusable logic, and advanced React patterns**.

Unlike Phase 1 (basic apps), here the goal is to:

* Reduce unnecessary re-renders
* Extract logic into reusable hooks
* Work with real browser APIs
* Manage complex UI state

This phase directly follows the roadmap topics:

* Performance hooks (`useMemo`, `useCallback`)
* Ref handling (`useRef`)
* Custom hooks
* Advanced patterns (composition, abstraction) 

---

# 🛠 Projects Overview

## 📌 Project 3: Infinite Scroll Image Gallery

### 🎯 Goal

Implement **efficient data loading and scroll-based rendering** using modern browser APIs.

---

### ⚙️ Features Implemented

* Infinite scrolling (no manual pagination)
* API integration (Unsplash / Pexels)
* Intersection Observer with `useRef`
* Custom hook: `useInfiniteScroll`
* Image lazy loading
* Optimized rendering using `useCallback`

---

### 🧠 Concepts Applied

#### 1. useRef + DOM API

Used to connect React with **Intersection Observer**.

#### 2. useCallback (Performance)

Prevents unnecessary re-creation of scroll handlers.

#### 3. Custom Hook Abstraction

Scroll logic extracted into reusable hook:

```js
useInfiniteScroll(callback)
```

#### 4. Lazy Loading

Improves performance by loading images only when needed.

---

### 🔄 Flow

```text
User scrolls
   ↓
Last image enters viewport
   ↓
Observer triggers callback
   ↓
Fetch next page
   ↓
Append new images
```

---

### 🎯 What This Project Demonstrates

* Working with browser APIs inside React
* Writing reusable hooks
* Handling async data efficiently
* Performance-focused UI design

---

## 📌 Project 4: Advanced Todo App

### 🎯 Goal

Build a **feature-rich application** that demonstrates **complex state handling and optimization**.

---

### ⚙️ Features Implemented

* Add / edit / delete todos
* Drag-and-drop reordering
* Persistent state using localStorage
* Filters (All / Active / Completed)
* Search functionality
* Undo / Redo system
* Performance optimization using `useMemo`

---

### 🧠 Concepts Applied

#### 1. Custom Hooks

* `useLocalStorage` → persistent state
* `useToggle` → UI state management

These follow the custom hook pattern from the learning module 

---

#### 2. Complex State Management (Undo/Redo)

State is managed using:

```js
{
  past: [],
  present: [],
  future: []
}
```

This enables:

* Time travel (undo)
* State replay (redo)

---

#### 3. useMemo (Performance)

Used to optimize:

* Filtering
* Searching
* Derived state

---

#### 4. Drag and Drop

Implemented using:

* react-beautiful-dnd

Handles:

* Reordering items
* Updating state without breaking UI

---

### 🔄 Flow

```text
User Action
   ↓
Update State
   ↓
Save to LocalStorage
   ↓
Store in History (Undo/Redo)
   ↓
Re-render Optimized UI
```

---

### 🎯 What This Project Demonstrates

* Managing complex application state
* Designing scalable logic
* Implementing real-world UX features
* Optimizing performance with memoization

---

# 🧩 Key Patterns Used

* Custom Hooks (logic reuse)
* Separation of concerns (logic vs UI)
* Memoization (`useMemo`, `useCallback`)
* Composition over inheritance
* Controlled state transitions

---

# 📈 Learning Outcome

By completing this phase, I can:

* Build reusable and scalable React logic
* Optimize component performance
* Handle complex UI interactions
* Integrate browser APIs effectively
* Structure real-world React applications

---

# 🧭 Next Step

Move to **Phase 3: State Management**

* Context API
* useReducer
* External state tools (Zustand / Redux Toolkit)

---

## 💡 Summary

Phase 2 is where React shifts from:

```text
"Building components"
        ↓
"Designing systems and abstractions"
```

---
