import ExpenseItem from "./ExpenseItem"

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <div className="space-y-2">
      {
        expenses.map(exp => (
          <ExpenseItem 
            key={exp.id} 
            expense={exp}
            onDelete={onDelete}
          />
        ))}
    </div>
  )
}

export default ExpenseList