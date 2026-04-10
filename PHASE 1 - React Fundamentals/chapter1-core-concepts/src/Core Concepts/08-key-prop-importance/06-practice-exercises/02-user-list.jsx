/* eslint-disable react-refresh/only-export-components */
// Exercise 2: User List with Conditional Rendering

function UserList() {
  const users = [
    { id: 1, name: 'Alice', role: 'admin', isOnline: true },
    { id: 2, name: 'Bob', role: 'user', isOnline: false },
    { id: 3, name: 'Charlie', role: 'moderator', isOnline: true }
  ];

  // TODO:
  // 1. Map through users
  // 2. Show green dot if online, gray if offline
  // 3. Show role badge with different colors
  // 4. Use proper keys

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <p>{user.isOnline ? 'green' : 'gray'}</p>
        </div>
      ))}
    </div>
  )
}