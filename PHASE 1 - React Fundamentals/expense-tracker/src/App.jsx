import AddExpenseForm from "./components/AddExpenseForm"
import ExpenseList from "./components/ExpenseList"
import FilterBar from "./components/FilterBar"
import Header from "./components/Header"
import TotalDisplay from "./components/TotalDisplay"

function App() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <AddExpenseForm />
      <FilterBar />
      <ExpenseList />
      <TotalDisplay />
    </div>
  )
}

export default App
