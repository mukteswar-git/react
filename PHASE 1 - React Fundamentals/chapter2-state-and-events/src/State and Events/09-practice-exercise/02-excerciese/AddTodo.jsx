import { useState } from "react";

function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  const handleAddClick = () => {
    onAdd(text)
    setText("")
  }

  return (
    <div className="py-2">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border rounded-md px-2" 
      />
      <button 
        className="px-2 py-0.5 ml-2 bg-gray-600 rounded-xs"
        onClick={handleAddClick}
      >
        Add
      </button>
    </div>
  )
}

export default AddTodo;