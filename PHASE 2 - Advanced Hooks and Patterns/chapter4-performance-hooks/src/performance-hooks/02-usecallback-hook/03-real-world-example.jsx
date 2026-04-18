import TodoItem from "./TodoItem";
import { useCallback, useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a project", completed: false },
  ]);

  // Memoized toggle function
  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []); // No dependencies needed

  // Memoized delete function
  const deleteTodo = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <div className="mt-4 border p-4 rounded-2xl max-w-1/2 ml-6">
      <h4 className="text-md sm:text-lg font-medium text-center mb-4">
        Todo App
      </h4>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
