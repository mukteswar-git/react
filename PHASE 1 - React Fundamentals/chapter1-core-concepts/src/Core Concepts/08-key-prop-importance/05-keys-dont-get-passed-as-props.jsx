// Keys Don't Get Passed as Props

function ListItem({ id, name }) {
  // Key prop is NOT accessible inside component
  // You won't receive 'key' in props
  console.log(id); // ✅ This works
  console.log(key); // ❌ Undefined - key is special 

  return <li>{name}</li>;
}

function List() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id}   // For React's internal use
          id={item.id}    // Passed as prop
          name={item.name}
        />
      ))}
    </ul>
  );
}