const AddExpenseForm = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-2">
      <input 
        type="text"
        placeholder="Expense Name"
        className="border p-2 w-full mb-2 rounded"
      />

      <input 
        type="number"
        placeholder="Amount"
        className="border p-2 w-full mb-2 rounded"
      />

      <select className="border p-2 w-full mb-2 rounded">
        <option>Food</option>
        <option>Travel</option>
      </select>

      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Add Expense
      </button>
    </div>
  )
}

export default AddExpenseForm