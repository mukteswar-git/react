// Exercise 2: Todo List

import { useState } from "react";
import AddTodo from "./AddTodo";

import { FaTrash } from "react-icons/fa"

// Build a complete todo list with:

// Add new todos
// Mark todos as complete/incomplete
// Delete todos
// Filter (all/active/completed)
// Edit todo text
// Show total count

function TodoList() {

  const [tasks, setTasks] = useState([
    {id: 1, text: 'Creae Todo App', completed: false},
    {id: 2, text: 'Drink Cofee', completed: false},
    {id: 3, text: 'Take Nap', completed: true},
  ])

  const handleToggle = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id
          ? { ...task, completed: !task.completed}
          : task 
      )
    )
  }

  const handleAdd = (text) => {
    const newTask = {
      id: tasks.length + 1,
      text: text,
      completed: false
    }
    setTasks(prev => [...prev, newTask])
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }


  return (
    <div className="ml-6 mt-4">
      <h1 className="text-xl font-bold">ToDo App</h1>
      <h2 className="text-lg font-semibold ml-2 mt-4">List of Tasks</h2>
      <div className="ml-4 mt-2">
        <pre>{JSON.stringify(tasks, null, 2)}</pre>
        {tasks.map(task => (
          <div key={task.id}>
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
            />
            <span className="ml-2">{task.text}</span>
            <button
              className="text-red-500 hover:text-red-700 ml-2"
              onClick={() => handleDelete(task.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))} 
      </div>

      <AddTodo onAdd={handleAdd} />

      <button className="px-2 py-0.5 ml-2 bg-gray-600 rounded-xs">
        All
      </button>

      <button className="px-2 py-0.5 ml-2 bg-gray-600 rounded-xs">
        Active
      </button>

      <button className="px-2 py-0.5 ml-2 bg-gray-600 rounded-xs">
        Completed
      </button>
    </div>
  )
}

export default TodoList;