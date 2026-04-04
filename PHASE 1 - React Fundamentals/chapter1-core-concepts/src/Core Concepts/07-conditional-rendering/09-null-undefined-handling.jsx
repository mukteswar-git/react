/* eslint-disable react-refresh/only-export-components */
// Null/Undefined Handling

function UserProfile({ user }) {
  // Early return if no user
  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      {/* Optional chaining */}
      <p>{user.address?.city || 'City not provided'}</p>
      
      {/* Conditional rendering with nullish coalescing */}
      <p>Age: {user.age ?? 'Not specified'}</p>
    </div>
  );
}