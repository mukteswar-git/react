// Method 3: Logical && (Show or Nothing)

function LogicalNotification({ hasMessage }) {
  return (
    <div className="text-gray-50">
      <h1>Dashboard</h1>
      {hasMessage && <p>You have new messages!</p>}
    </div>
  );
}

export default LogicalNotification;