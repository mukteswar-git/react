// Custom Comparison Function

import React from "react";

const UserCard = React.memo(
  ({ user, theme }) => {
    return (
      <div className={theme}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.theme === nextProps.theme
    );
  },
);
