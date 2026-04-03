// Demonstration of Destructuring
function Greetings({ name, age }) {
  return (
    <div className="text-gray-50">
      <h1>Hello {name}!</h1>
      <p>Age: {age}</p>
    </div>
  )
}

export default Greetings;