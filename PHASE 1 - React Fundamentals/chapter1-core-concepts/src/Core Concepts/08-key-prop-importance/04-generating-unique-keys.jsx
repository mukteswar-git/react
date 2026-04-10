/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Generating Unique Keys

// Option 1: Use database IDs (best)
const users = [
  { id: 101, name: 'Alice' },  // ID from database
  { id: 102, name: 'Bob' }
];

// Option 2: Use UUID library
import { v4 as uuidv4 } from 'uuid';

const addTodo = (text) => {
  const newTodo = {
    id: uuidv4(), // Generates: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
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