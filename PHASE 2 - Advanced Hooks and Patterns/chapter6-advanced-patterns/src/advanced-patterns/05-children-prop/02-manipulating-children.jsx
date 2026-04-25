/* eslint-disable react-refresh/only-export-components */
// Manipulating Children

import { Children, cloneElement } from "react";

function List({ children, className }) {
  return (
    <ul className={className}>
      {Children.map(children, (child, index) => {
        // Add additional props to each child
        return cloneElement(child, {
          index,
          className: `list-item ${child.props.className || ''}`
        });
      })}
    </ul>
  );
}

function ListItem({ children, index, className, highlighted }) {
  return (
    <li
      className={className}
      style={{
        background: highlighted ? 'yellow' : 'transparent',
        padding: '10px'
      }}
    >
      {index + 1}. {children}
    </li>
  );
}

// Usage
function App() {
  return (
    <List className="my-list">
      <ListItem>First item</ListItem>
      <ListItem highlighted>Second item (highlighted)</ListItem>
      <ListItem>Third item</ListItem>
    </List>
  )
}