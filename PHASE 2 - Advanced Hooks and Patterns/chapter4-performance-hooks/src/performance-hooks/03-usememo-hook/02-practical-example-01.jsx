// 1. Filtering and Sorting Large Lists

import { useMemo } from "react";

const UserList = ({ users, searchTerm, sortBy }) => {
  // Memoize filtered and sorted users
  const processedUsers = useMemo(() => {
    console.log("Processing users...");

    // Filter
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "age") {
        return a.age - b.age;
      }
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortBy]);

  return (
    <ul>
      {processedUsers.map((user) => (
        <li key={user.id}>
          {user.name} - {user.age}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
