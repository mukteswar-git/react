// Method 2: Ternary Operator (Inside JSX)

function TernaryGreeting({ isLoggedIn }) {
  return (
    <div className="text-gray-50">
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}

export default TernaryGreeting;