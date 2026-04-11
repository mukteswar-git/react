import ExpenseItem from "./ExpenseItem"

const ExpenseList = () => {
  return (
    <div className="space-y-2">
      {/* Map expenses here */}
      <ExpenseItem />
      <ExpenseItem />
      <ExpenseItem />
    </div>
  )
}

export default ExpenseList