// Method 1: if-else (Outside JSX)

function ConditionalGreeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1 className="text-gray-50">Welcome back!</h1>;
  } else {
    return <h1 className="text-gray-50">Please sign in</h1>;
  }
}

export default ConditionalGreeting;