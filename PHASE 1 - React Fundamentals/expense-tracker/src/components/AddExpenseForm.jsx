import { useState } from "react"

const AddExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount || !category) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category
    };

    onAdd(newExpense);

    // reset form
    setTitle("");
    setAmount("");
    setCategory("");
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-2">
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense Name"
          className="border p-2 w-full mb-2 rounded"
        />

        <input 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          className="border p-2 w-full mb-2 rounded"
        />

        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
        </select>

        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Expense
        </button>
      </form>
    </div>
  )
}

export default AddExpenseForm