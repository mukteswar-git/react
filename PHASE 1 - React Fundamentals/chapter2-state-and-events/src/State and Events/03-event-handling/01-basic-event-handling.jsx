/* eslint-disable react-refresh/only-export-components */
// Basic Event Handling

// React uses synthetic events (cross-browser wrapper around native events).

function EventDemo() {
  function EventDemo() {
    const handleClick = () => {
      console.log('Button clicked!');
    };

    const handleClickWithParam = (message) => {
      console.log(message);
    };

    return (
      <div>
        {/* Method 1: Inline arrow function */}
        <button onClick={() => console.log('Clicked!')}>
          Click Me 
        </button>

        {/* Method 2: Reference to funciton */}
        <button onClick={handleClick}>
          Click Me 
        </button>

        {/* Method 3: Arrow function with parameters */}
        <button onClick={() => handleClickWithParam('Hello!')}>
          Click Me 
        </button>
      </div>
    )
  }
}