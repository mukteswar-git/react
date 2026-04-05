/* eslint-disable react-refresh/only-export-components */
// Switch Statement Alternative

function UserRole({ role }) {
  const renderRole = () => {
    switch(role) {
      case 'admin':
        return <AdminPanel />;
      case 'moderator':
        return <ModeratorPanel />;
      case 'user':
        return <UserPanel />;
      default:
        return <GuestPanel />;
    }
  };

  return <div>{renderRole()}</div>
}