const FilterBar = ({ filter, setFilter}) => {
  return (
    <div className="mb-4">
      <select 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="All">All</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
      </select>
    </div>
  )
}

export default FilterBar