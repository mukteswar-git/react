// Prop Drilling = Passing props through multiple levels of components

// Deep component needs data from top
function Grandparent() {
  const user = { name: 'Mukti', role: 'Admin' };

  return <Parent user={user} />
}

function Parent({ user }) {
  // Parent doesn't use 'user', just passes it down
  return <Child user={user} />;
}

function Child({ user }) {
  // Child doesn't use 'user', just passes it down
  return <Grandchild user={user} />;
}

function Grandchild({ user }) {
  // Finally user here!
  return <p>Hello {user.name}, you are {user.role}</p>;
}

export default Grandparent;