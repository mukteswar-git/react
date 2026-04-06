// Controlled Component Example

import { useState } from "react";

function ControlledExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    // Convert to lowercase automatically
    setEmail(e.target.value.toLowerCase());
  };

  const handlePasswordChange = (e) => {
    // Limit password length
    if (e.target.value.length <= 20) {
      setPassword(e.target.value);
    }
  };

  return (
    <form className="pl-6 mt-4 flex flex-col max-w-xs">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email (auto-lowercase)"
        className="pl-2 mb-2 border rounded-xs"
      />
      <input 
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password (max 20 chars)"
        className="pl-2 mb-2 border rounded-xs"
      />
      <p>Password length: {password.length}/20</p>
    </form>
  );
}

export default ControlledExample;