/* eslint-disable react-refresh/only-export-components */
// Updating Arrays

import { useState } from "react";

 
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
  const removeItem  = (index) => {
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