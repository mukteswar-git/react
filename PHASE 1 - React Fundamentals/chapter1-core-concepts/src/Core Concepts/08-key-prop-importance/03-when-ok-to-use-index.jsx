// ✅ OK to use index when:
// 1. List is static (never changes)
// 2. Items have no IDs
// 3. List is never reordered/filtered

function StaticList() {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <ul>
      {daysOfWeek.map((day, index) => (
        <li key={index}>{day}</li>  // OK - list never changes
      ))}
    </ul>
  );
}