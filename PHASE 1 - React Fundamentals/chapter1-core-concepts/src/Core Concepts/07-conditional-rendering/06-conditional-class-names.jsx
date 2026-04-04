/* eslint-disable react-refresh/only-export-components */
// Conditional Class Names

function Button({ isPrimary, isDisabled }) {
  return (
    <button
      className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'} ${isDisabled ? 'disabled' : ''}`}
      disabled={isDisabled}
    >
      Click Me
    </button>
  )
}