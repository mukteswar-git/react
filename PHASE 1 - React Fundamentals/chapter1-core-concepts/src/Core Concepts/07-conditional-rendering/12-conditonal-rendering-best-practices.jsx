/* eslint-disable react-refresh/only-export-components */
// Conditional Rendering Best Practices

// ✅ Do: Keep conditions simple and readable
function Good({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
}

// ❌ DON'T: Nest too many ternaries
function Bad({ status }) {
  return (
    <div>
      {status === 'loading' ? <Spinner /> : 
       status === 'error' ? <Error /> : 
       status === 'empty' ? <Empty /> : 
       status === 'success' ? <Data /> : null}
    </div>
  );
}

// ✅ Do: Use early returns for complex logic
function Better({ status }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  if (status === 'empty') return <Empty />;
  
  return <Data />;
}

// ✅ Do: Extract complex conditions to variables
function UserCard({ user }) {
  const isPremium = user.subscription === 'premium';
  const hasVerifiedEmail = user.emailVerified;
  const canAccessFeature = isPremium && hasVerifiedEmail;
  
  return (
    <div>
      <h2>{user.name}</h2>
      {canAccessFeature && <PremiumFeature />}
    </div>
  );
}