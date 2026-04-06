// Simple Form

import { useState } from "react";

function SimpleForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 ml-6 mt-4 max-w-sm"
    >
      <input 
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="px-2 py-1 border rounded-lg"
      />

      <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="px-2 py-1 border rounded-lg"
      />

      <input 
        type="password"
        name="password"
        value={formData}
        onChange={handleChange}
        placeholder="Password"
        className="px-2 py-1 border rounded-lg"
      />
      <button type="submit" className="bg-gray-600 p-1 border rounded-lg">Submit</button>      
    </form>
  )
}

export default SimpleForm;