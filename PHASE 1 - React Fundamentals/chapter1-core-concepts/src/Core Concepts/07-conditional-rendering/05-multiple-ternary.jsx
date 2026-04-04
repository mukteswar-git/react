/* eslint-disable react-refresh/only-export-components */
// Multiple Conditions with Ternary

function UserBadge({ status }) {
  return (
    <div className={
      status === 'online' ? 'badge-green' :
      status === 'away' ? 'badge-yellow' :
      status === 'offline' ? 'badge-gray' :
      'badge-default'
    }>
      {status}
    </div>
  )
}