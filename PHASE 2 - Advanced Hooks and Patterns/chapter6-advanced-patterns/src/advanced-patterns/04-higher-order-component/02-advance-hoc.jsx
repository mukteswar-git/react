/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Advanced HOC: withAuth

import { useEffect } from "react";

function withAuth(Component, options = {}) {
  return function WithAuthComponent(props) {
    const navigate = useNavigate();
    const { requiredRole = null, redirectTo = '/login' } = options;

    // Simulated auth check (replace with real auth logic)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuthenticated = !!user;
    const hasRequiredRole = !requiredRole || user?.role === requiredRole;

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(redirectTo);
      } else if (!hasRequiredRole) {
        navigate('/unauthorized');
      }
    }, [isAuthenticated, hasRequiredRole, navigate]);

    if (!isAuthenticated || !hasRequiredRole) {
      return null;
    }

    return <Component {...props} user={user} />
  };
}

// Usage
function Dashboard({ user }) {
  return <h1>Welcome, {user.name}</h1>
}

function AdminPanel({ user }) {
  return <h1>Admin Panel - {user.name}</h1>
}

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAdminPanel = withAuth(AdminPanel, { requiredRole: 'admin' });