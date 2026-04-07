// Best Practices

import { useEffect, useState } from "react";

// 1. Keep State Minimal

// ❌ Bad: Redundant state
function UserProfile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [fullName, setFullName] = useState('John Doe'); // Redundant!

  return <div>{fullName}</div>
}

// ✅ Good: Derive data from existing state
function UserProfile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  
  const fullName = `${firstName} ${lastName}`; // Calculated

  return <div>{fullName}</div>;
}

// 2. Group Related State

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
    setFormData(prev => ({ ...prev, [name]: value}))
  };
}

// 3. Avoid State When Possible

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

// 4. Use Functional Updates

// ❌ Risky: Using current state value
const increments = () => {
  setCount(count + 1);
  setCount(count + 1); // Won't work as expected!
};

// ✅ Safe: Using functional update
const increment = () => {
  setCount(c => c + 1);
  setCount(c => c + 1); // Works correctly!
};

// 5. Name Event Handlers Consistently

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