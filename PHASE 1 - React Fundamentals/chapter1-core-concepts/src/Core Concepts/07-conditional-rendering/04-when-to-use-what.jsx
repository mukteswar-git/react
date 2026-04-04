/* eslint-disable react-refresh/only-export-components */
// When to Use Each Method

// Use if-else: Early returns, complex logic
function UserDashboard({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === 'admin') {
    return <AdminPanel />;
  }

  return <UserPanel />;
}

// Use ternary: Simple two-way choice
function Status({ isOnline }) {
  return <span>{isOnline ? 'Online' : 'Offline'}</span>;
}

// Use &&: Show element or nothing
function ErrorMessage({ error }) {
  return (
    <div>
      {error && <p className="error">{error}</p>}
    </div>
  )
}