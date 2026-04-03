// Props Types
function PropsExample({ text, number, boolean, array, object, func }) {
  return (
    <div className="text-gray-50">
      <p>Text: {text}</p>
      <p>Number: {number}</p>
      <p>Boolean: {boolean ? 'yes' : 'no'}</p>
      <p>First item: {array[0]}</p>
      <p>City: {object.city}</p>
      <button onClick={func} className="bg-gray-600 border border-amber-500 px-1 mt-1">
        Click
      </button>
    </div>
  )
}

export default PropsExample;