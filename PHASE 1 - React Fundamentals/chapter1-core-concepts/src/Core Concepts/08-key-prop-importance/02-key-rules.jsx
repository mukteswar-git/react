/* eslint-disable react-hooks/purity */
/* eslint-disable react-refresh/only-export-components */
// Key Rules

// Rule 1: Keys Must Be Unique Among Siblings

// ✅ CORRECT - Unique IDs
function GoodList() {
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ];

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ❌ WRONG - Duplicate keys
function BadList() {
  const items = [
    { id: 1, name: 'Apple' },
    { id: 1, name: 'Banana' },  // Same ID!
    { id: 1, name: 'Cherry' }   // Same ID!
  ];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>  // ⚠️ Warning!
      ))}
    </ul>
  );
}

// Rule 2: Keys Must be Stable(Not Change)

// ❌ WRONG - using Math.random()
function BadLists() {
  const items = ['Apple', 'Banana', 'Cherry'];

  return (
    <ul>
      {items.map(item => (
        <li key={Math.random()}>{item}</li> // New key on every render!
      ))}
    </ul>
  );
}

// ✅ CORRECT - Stable unique ID
function GoodLists() {
  const items = [
    { id: 'apple-1', name: 'Apple' },
    { id: 'banana-2', name: 'Banana' },
    { id: 'cherry-3', name: 'Cherry' }
  ];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Rule 3: Don't Use Index as Key (Unless No Other Option)

// ⚠️ AVOID - Using index as key
function AvoidThis() {
  const items = ['Apple', 'Banana', 'Cherry'];

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>  // Works, but problematic
      ))}
    </ul>
  );
}

// Why it's bad:
// Original: [0: Apple, 1: Banana, 2: Cherry]
// After removing Banana: [0: Apple, 1: Cherry]
// React thinks: Item 1 changed from Banana to Cherry
// Reality: Item 1 (Banana) was removed, Cherry is still ritem 2