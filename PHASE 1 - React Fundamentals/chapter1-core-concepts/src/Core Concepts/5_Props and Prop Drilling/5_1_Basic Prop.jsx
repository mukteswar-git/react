// Child component receives props
function Greeting(props) {
  return <h3 className="text-xl sm:text-2xl font-medium text-gray-100 ml-4">
    Hello {props.name}
  </h3>
}

export default Greeting;