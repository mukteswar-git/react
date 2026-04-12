const ExpenseItem = ({ expense, onDelete }) => {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
      <div>
        <p className="font-semibold text-gray-800">{expense.title}</p>
        <p className="text-sm text-gray-500">{expense.category}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold">₹{expense.amount}</span>

        <button 
          onClick={() => onDelete(expense.id)}
          className="text-red-500"
        >
          x
        </button>
      </div>
    </div>
  )
}

export default ExpenseItem