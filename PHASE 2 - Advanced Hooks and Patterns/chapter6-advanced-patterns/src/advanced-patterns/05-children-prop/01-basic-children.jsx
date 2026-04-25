/* eslint-disable react-refresh/only-export-components */
// Basic Children Usage

function Card({ children, title }) {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="User Profile">
      <img src="avatar.jpg" alt="Avatar" />
      <h3>John Doe</h3>
      <p>Software Developer</p>
    </Card>
  );
}
