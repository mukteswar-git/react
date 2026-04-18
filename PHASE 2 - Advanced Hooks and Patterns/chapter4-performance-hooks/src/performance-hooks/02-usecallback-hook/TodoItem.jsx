import React from "react";

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} rendered`);

  return (
    <div className="flex flex-row items-center gap-2 mb-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="flex-1">{todo.text}</span>
      <button className="bg-red-500 text-sm px-2 rounded-2xl" onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

export default TodoItem;
