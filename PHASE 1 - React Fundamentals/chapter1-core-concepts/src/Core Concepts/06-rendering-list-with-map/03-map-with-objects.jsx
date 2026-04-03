// .map() with Objects

function UserList() {
  const users = [
    { id: 1, name: 'Alice', age: 25},
    { id: 2, name: 'Bob', age: 30},
    { id: 3, name: 'Charlie', age: 35},
  ];

  return (
    <div className="text-gray-50">
      {users.map((user) => (
        <div key={user.id} className="py-2">
          <h3>{user.name}</h3>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  )
}

export default UserList;