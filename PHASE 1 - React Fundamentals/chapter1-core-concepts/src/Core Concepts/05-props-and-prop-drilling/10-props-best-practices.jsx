/* eslint-disable react-refresh/only-export-components */
// Props Best Practices

// ✅ DO: Destructure props
function Good({ name, age }) {
  return <p>{name} is {age}</p>
}

// ❌ DON'T: Use props object everywhere
function Bad(props) {
  return <p>{props.name} is {props.age}</p>
}

// ✅ DO: Use default values
function Button({ label = 'Click Me', type = 'button' }) {
  return <button type={type}>{label}</button>;
}

// ✅ DO: Spread props when needed
function Input(props) {
  return <input className="custom-input" {...props} />
}
// Usage: <Input type="text" placeholder="Name" />

// ✅ DO: Keep prop names clear and consistent
<>
  // Usage: <Input type="text" placeholder="Name" />
  // ✅ DO: Keep prop names clear and consistent
  <ProductCard
    productName="Laptop" //Clear
    productPrice={999} />
    
  // ❌ DON'T: Use unclear names
  <ProductCard
    name="Laptop" // Ambiguous - product name or user name?
    price={999} // OK
  />
</>