import { useState } from "react"
import AddExpenseForm from "./components/AddExpenseForm"
import ExpenseList from "./components/ExpenseList"
import FilterBar from "./components/FilterBar"
import Header from "./components/Header"
import TotalDisplay from "./components/TotalDisplay"

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Pizza", amount: 200, category: "Food" },
    { id: 2, title: "Movie", amount: 300, category: "Travel" },
  ]);

  const [filter, setFilter] = useState("All");

  const handleDelete = (id) => {
    setExpenses(prev => 
      prev.filter(exp => exp.id !== id)
    );
  };

  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  const filteredExpenses = expenses.filter(exp =>
    filter === "All" ? true : exp.category === filter
  );

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <AddExpenseForm onAdd={handleAddExpense} />
      <FilterBar filter={filter} setFilter={setFilter} />
      <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} />
      <TotalDisplay total={total} />
    </div>
  )
}

export default App
