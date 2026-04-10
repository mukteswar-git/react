/* eslint-disable react-refresh/only-export-components */
// Updating Objects

import { useState } from "react";

function ObjectUpdates() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA'
    }                                        
  });

  // Update top-level property
  const updateName = () => {
    setUser(prev => ({
      ...prev,
      name: 'Jane'
    }));
  };

  // Update nested properties
  const updateCity = () => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: 'Los Angeles' 
      }
    }));
  };

  // Update multiple properties
  const updateMultiple = () => {
    setUser(prev => ({
      ...prev,
      name: 'Bob',
      age: 25 
    }));
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>City: {user.address.city}</p>
      
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateCity}>Update City</button>
      <button onClick={updateMultiple}>Update Multiple</button>
    </div>
  );
}