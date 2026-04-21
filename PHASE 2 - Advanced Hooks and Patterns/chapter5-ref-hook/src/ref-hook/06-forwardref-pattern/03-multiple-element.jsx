// Example 3: forwardRef with Multiple Elements

import { forwardRef, useRef } from "react";

const FormGroup = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>{label}</label>
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "8px",
          border: error ? "2px solid red" : "1px solid #ccc",
          borderRadius: "4px",
        }}
        {...props}
      />
      {error && <span style={{ color: "red", fontSize: "12px" }}>{error}</span>}
    </div>
  );
});

function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRef.current.value) {
      emailRef.current.focus();
      return;
    }

    if (!passwordRef.current.value) {
      passwordRef.current.focus();
      return;
    }

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup
        ref={emailRef}
        label="Email"
        type="email"
        placeholder="Enter you email"
      />

      <FormGroup
        ref={passwordRef}
        label="Password"
        type="password"
        placeholder="Enter you password"
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
