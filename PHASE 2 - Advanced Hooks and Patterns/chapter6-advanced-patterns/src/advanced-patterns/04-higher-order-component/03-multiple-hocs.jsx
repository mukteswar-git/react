/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Composing Multiple HOCs

import { Component, useEffect, useState } from "react"

function withLogger(Component) {
  return function WithLoggerComponent(props) {
    useEffect(() => {
      console.log('Component mounted with props:', props);
      return () => console.log('Component unmounted');
    }, [props]);

    return <Component {...props} />;
  };
}

function withErrorBoundary(Component) {
  return class WithErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong: {this.state.error.message}</div>;
      }
      return <Component {...this.props} />;
    }
  };
}

function withTheme(Component) {
  return function WithThemeComponent(props) {
    const [theme, setTheme] = useState('light');

    return (
      <Component 
        {...props}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
      />
    )
  };
}

// Compose multiple HOCs
const enhance = (Component) => 
  withLogger(
    withErrorBoundary(
      withTheme(
        withLoading(Component)
      )
    )
  );

const EnhancedComponent = enhance(MyComponent);