const FilterBar = () => {
  return (
    <div className="mb-4">
      <select className="border p-2 w-full rounded">
        <option>All</option>
        <option>Food</option>
        <option>Travel</option>
      </select>
    </div>
  )
}

export default FilterBar