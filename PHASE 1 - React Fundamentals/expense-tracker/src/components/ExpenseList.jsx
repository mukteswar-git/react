import ExpenseItem from "./ExpenseItem"

const ExpenseList = ({ expenses }) => {
  return (
    <div className="space-y-2">
      {
        expenses.map(exp => (
          <ExpenseItem key={exp.id} expense={exp} />
        ))
      }
    </div>
  )
}

export default ExpenseList