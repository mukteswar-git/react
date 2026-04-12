import { useState } from "react"
import AddExpenseForm from "./components/AddExpenseForm"
import ExpenseList from "./components/ExpenseList"
import FilterBar from "./components/FilterBar"
import Header from "./components/Header"
import TotalDisplay from "./components/TotalDisplay"

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Pizza", amount: 200, category: "Food" },
    { id: 2, title: "Movie", amount: 300, category: "Entertainment" },
  ]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <AddExpenseForm />
      <FilterBar />
      <ExpenseList expenses={expenses}/>
      <TotalDisplay />
      
    </div>
  )
}

export default App
