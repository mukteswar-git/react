/* eslint-disable react-refresh/only-export-components */
// Conditional Styles

function Alert({ type, message }) {
  const alertStyles = {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: type === 'error' ? '#ffcccc' : 
                     type === 'success' ? '#ccffcc' : 
                     type === 'warning' ? '#ffffcc' : '#e0e0e0',
    color: type === 'error' ? '#cc0000' : 
           type === 'success' ? '#00cc00' : 
           type === 'warning' ? '#cccc00' : '#333'
  };
  
  return <div style={alertStyles}>{message}</div>;
}