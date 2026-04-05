/* eslint-disable react-refresh/only-export-components */
// Real-World Example: Authentication UI

function App({ user, isLoading, error }) {
  // Loading state
  if (isLoading) {
    return (
      <div className="loading">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload}>
          Retry
        </button>
      </div>
    );
  }

  // Succes state - show different UI based on user
  return (
    <div className="app">
      <header>
        <h1>My App</h1>
        {user ? (
          <div className="user-menu">
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
            <button>Logout</button>
          </div>
        ) : (
          <button>Login</button>
        )}
      </header>

      <main>
        {user ? (
          <>
            <h2>Welcom back, {user.name}</h2>
            {user.isPremium && <PremiumBanner />}
            <Dashboard />
          </>
        ) : (
          <>
            <h2>Welcome to My App</h2>
            <p>Please log in to continue</p>
            <LoginForm />
          </>
        )}
      </main>
    </div>
  )
}