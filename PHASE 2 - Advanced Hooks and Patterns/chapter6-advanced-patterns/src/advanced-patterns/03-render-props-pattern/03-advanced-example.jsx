/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Advanced Example: List with Virtualization

import { useRef, useState } from "react";

function VirtualList({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div style={{ height: items.length * itemHeight }}>
      <div style={{ transform: `translateY(${offsetY}px)`}}>
        <div>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Usage
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <VirtualList 
      items={items}
      itemHeight={50}
      containerHeight={400}
      renderItem={(item, index) => (
        <div style={{
          padding: '10px',
          borderBottom: '1px solid #ccc',
          background: index % 2 === 0 ? '#f9f9f9' : 'white'
        }}>
          {item}
        </div>
      )}
    />
  )
}