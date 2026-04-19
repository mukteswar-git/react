/* eslint-disable react-refresh/only-export-components */
// Strategy 5: Virtualization for Long Lists
import { FixedSizeList } from 'react-window';

// ❌ Bad - render 10,000 items
function BadList({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// ✅ Good - only renders visible items
function GoodList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}