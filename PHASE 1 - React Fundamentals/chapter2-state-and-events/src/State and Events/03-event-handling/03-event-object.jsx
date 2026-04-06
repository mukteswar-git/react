// Event Object

function EventObjectDemo() {
  const handleEvent = (event) => {
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);

    // Prevent default behaviour
    event.preventDefault();

    // Stop event propagation
    event.stopPropagation();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Input detatils:', { name, value, type, checked });
  };

  return (
    <div>
      <a href="https://example.com" onClick={handleEvent}>
        Click (won't negative)
      </a>

      <input 
        name="username"
        onChange={handleInputChange}
        placeholder="Type something"
      />
    </div>
  );
}