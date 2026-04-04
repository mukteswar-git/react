/* eslint-disable react-refresh/only-export-components */
// Rendering Nothing

function ConditionalComponent({ shouldShow, children }) {
  // Don't render anything if shouldShow is false
  if (!shouldShow) {
    return null;  // Returns nothing, component won't appear
  }
  
  return <div>{children}</div>;
}

// Usage
<ConditionalComponent shouldShow={false}>
  This won't be rendered
</ConditionalComponent>