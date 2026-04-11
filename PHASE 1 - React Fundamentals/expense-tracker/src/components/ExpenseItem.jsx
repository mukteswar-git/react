const ExpenseItem = () => {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
      <div>
        <p className="font-semibold text-gray-800">Pizza</p>
        <p className="text-sm text-gray-500">Food</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold">$200</span>

        <button className="text-red-500">
          x
        </button>
      </div>
    </div>
  )
}

export default ExpenseItem