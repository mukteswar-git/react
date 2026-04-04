function TodoList() {
  const todos = [
    { id: 1, text: 'Buy groceries', completed: false},
    { id: 2, text: 'Walk the dog', completed: true },
    { id: 3, text: 'Write code', completed: false },
    { id: 4, text: 'Go for Photoshoot', completed: false}
  ];

  return (
    <div className="text-gray-50">
      <h1 className="py-2">My Todos</h1>
      {todos.map(todo => (
        <div
          key={todo.id}
        >
          <input type="checkbox" checked={todo.completed} />
          <span className="ml-1">{todo.text}</span>
        </div>
      ))}

      <p className="py-2
      ">
        Completed: {todos.filter(t => t.completed).length} / {todos.length}
      </p>
    </div>
  )
}

export default TodoList;