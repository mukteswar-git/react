// Default Props
function DefaultProps({ name = 'Guest', age = 0 }) {
  return (
    <div className="text-gray-50">
      <h1>Hello {name}!</h1>
      <p>Age: {age}</p>
    </div>
  )
}

export default DefaultProps;