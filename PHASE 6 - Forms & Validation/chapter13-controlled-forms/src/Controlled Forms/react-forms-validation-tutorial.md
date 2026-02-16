# React Forms & Validation - Complete Tutorial

## Table of Contents
1. [Introduction to Forms in React](#introduction)
2. [Controlled Components](#controlled-components)
3. [Multiple Input Handling](#multiple-input-handling)
4. [Form Validation](#form-validation)
5. [Error Messages](#error-messages)
6. [Submit Handling](#submit-handling)
7. [Complete Examples](#complete-examples)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Practice Exercises](#practice-exercises)

---

## Introduction to Forms in React

Forms are essential for collecting user input in web applications. React handles forms differently from traditional HTML forms using a concept called "controlled components."

### Why Controlled Components?

In React, form data is typically handled by components rather than the DOM. This gives you:
- **Single source of truth**: React state controls the form
- **Validation**: Easy to validate as users type
- **Dynamic behavior**: Change form based on user input
- **Better UX**: Instant feedback and error handling

---

## Controlled Components

A controlled component is an input element whose value is controlled by React state.

### Basic Controlled Input

```jsx
import { useState } from 'react';

function SimpleForm() {
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

**Key Points:**
- The `value` prop is set to state (`name`)
- The `onChange` handler updates state
- React re-renders with the new value

### Different Input Types

#### Text Input
```jsx
const [text, setText] = useState('');

<input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

#### Textarea
```jsx
const [message, setMessage] = useState('');

<textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows="4"
/>
```

#### Select Dropdown
```jsx
const [country, setCountry] = useState('usa');

<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="usa">United States</option>
  <option value="canada">Canada</option>
  <option value="uk">United Kingdom</option>
</select>
```

#### Checkbox
```jsx
const [agreed, setAgreed] = useState(false);

<input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

#### Radio Buttons
```jsx
const [gender, setGender] = useState('');

<div>
  <label>
    <input
      type="radio"
      value="male"
      checked={gender === 'male'}
      onChange={(e) => setGender(e.target.value)}
    />
    Male
  </label>
  <label>
    <input
      type="radio"
      value="female"
      checked={gender === 'female'}
      onChange={(e) => setGender(e.target.value)}
    />
    Female
  </label>
</div>
```

---

## Multiple Input Handling

When dealing with multiple inputs, managing each with separate state variables becomes cumbersome. Instead, use a single state object.

### Using a Single State Object

```jsx
import { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    country: 'usa',
    newsletter: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="usa">United States</option>
        <option value="canada">Canada</option>
        <option value="uk">United Kingdom</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
        Subscribe to newsletter
      </label>
    </form>
  );
}
```

**Key Techniques:**
- Use `name` attribute matching state property names
- Destructure event target properties
- Use computed property names: `[name]: value`
- Spread previous state to preserve other fields
- Handle checkboxes separately with `checked` property

---

## Form Validation

Validation ensures users provide correct and complete information.

### Manual Validation Approaches

#### 1. Real-time Validation (On Change)

```jsx
import { useState } from 'react';

function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email';
    }
    
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
    </div>
  );
}
```

#### 2. Validation on Blur (When User Leaves Field)

```jsx
function BlurValidation() {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [touched, setTouched] = useState(false);

  const validateUsername = (value) => {
    if (!value) {
      return 'Username is required';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const handleBlur = () => {
    setTouched(true);
    setUsernameError(validateUsername(username));
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleBlur}
        placeholder="Username"
      />
      {touched && usernameError && (
        <p style={{ color: 'red' }}>{usernameError}</p>
      )}
    </div>
  );
}
```

#### 3. Validation on Submit

```jsx
function SubmitValidation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form is valid!', formData);
      // Submit the form
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Common Validation Rules

```jsx
const validationRules = {
  required: (value) => {
    return value.trim() !== '' || 'This field is required';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Invalid email address';
  },
  
  minLength: (min) => (value) => {
    return value.length >= min || `Must be at least ${min} characters`;
  },
  
  maxLength: (max) => (value) => {
    return value.length <= max || `Must be no more than ${max} characters`;
  },
  
  pattern: (regex, message) => (value) => {
    return regex.test(value) || message;
  },
  
  match: (otherValue, fieldName) => (value) => {
    return value === otherValue || `Must match ${fieldName}`;
  },
  
  numeric: (value) => {
    return !isNaN(value) || 'Must be a number';
  },
  
  minValue: (min) => (value) => {
    return parseFloat(value) >= min || `Must be at least ${min}`;
  },
  
  maxValue: (max) => (value) => {
    return parseFloat(value) <= max || `Must be no more than ${max}`;
  }
};
```

---

## Error Messages

Effective error messages improve user experience.

### Error Message Best Practices

1. **Be Specific**: Tell users exactly what's wrong
2. **Be Helpful**: Suggest how to fix the issue
3. **Show Errors Contextually**: Display errors near the relevant field
4. **Use Appropriate Timing**: Don't overwhelm users too early

### Error Display Component

```jsx
function ErrorMessage({ error }) {
  if (!error) return null;
  
  return (
    <p style={{
      color: '#d32f2f',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
      marginBottom: '0.5rem'
    }}>
      {error}
    </p>
  );
}

// Usage
<div>
  <input
    type="email"
    value={email}
    onChange={handleChange}
    className={errors.email ? 'input-error' : ''}
  />
  <ErrorMessage error={errors.email} />
</div>
```

### Input with Error State

```jsx
function FormInput({ label, name, type = 'text', value, onChange, error, ...props }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.25rem' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: error ? '2px solid #d32f2f' : '1px solid #ccc',
          borderRadius: '4px',
          outline: 'none'
        }}
        {...props}
      />
      {error && (
        <p style={{
          color: '#d32f2f',
          fontSize: '0.875rem',
          marginTop: '0.25rem'
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

// Usage
<FormInput
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="Enter your email"
/>
```

### Summary Error List

```jsx
function ErrorSummary({ errors }) {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (errorMessages.length === 0) return null;
  
  return (
    <div style={{
      backgroundColor: '#ffebee',
      border: '1px solid #d32f2f',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>
        Please correct the following errors:
      </h4>
      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {errorMessages.map((error, index) => (
          <li key={index} style={{ color: '#d32f2f' }}>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Usage in form
<form onSubmit={handleSubmit}>
  <ErrorSummary errors={errors} />
  {/* form fields */}
</form>
```

---

## Submit Handling

Proper form submission handling is crucial for a good user experience.

### Basic Submit Handler

```jsx
function BasicSubmit() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Form submitted:', formData);
    
    // Process the data
    // Send to API, etc.
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Submit with Loading State

```jsx
function LoadingSubmit() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated API call
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setSubmitSuccess(true);
      console.log('Success!', formData);
      
      // Reset form
      setFormData({ email: '', password: '' });
      
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitError && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div style={{ color: 'green', marginBottom: '1rem' }}>
          Form submitted successfully!
        </div>
      )}

      {/* form fields */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Reset and Clear Form

```jsx
function ResetForm() {
  const initialFormState = {
    name: '',
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    
    // Reset form after submission
    setFormData(initialFormState);
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Clear Form
      </button>
    </form>
  );
}
```

---

## Complete Examples

### Example 1: Contact Form

```jsx
import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email';
        }
        return '';

      case 'subject':
        if (!value.trim()) return 'Subject is required';
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) {
          return 'Message must be at least 10 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate if field has been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validate(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validate(name, value)
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validate(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateAll();
    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTouched({});
      setErrors({});

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Contact Us</h2>

      {submitSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Thank you! Your message has been sent successfully.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.name && touched.name ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="Your name"
          />
          {touched.name && errors.name && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.email && touched.email ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="your.email@example.com"
          />
          {touched.email && errors.email && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.subject && touched.subject ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="What is this about?"
          />
          {touched.subject && errors.subject && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.subject}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="5"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.message && touched.message ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit'
            }}
            placeholder="Your message..."
          />
          {touched.message && errors.message && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#1976d2',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
```

### Example 2: User Registration Form

```jsx
import { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email address';
        }
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      case 'age':
        if (!value) return 'Age is required';
        const age = parseInt(value);
        if (isNaN(age) || age < 13) return 'You must be at least 13 years old';
        if (age > 120) return 'Please enter a valid age';
        return '';

      case 'acceptTerms':
        if (!value) return 'You must accept the terms and conditions';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Re-validate confirmPassword if password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const error = validateField(name, fieldValue);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Registration successful!', formData);
      // Submit to API
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.username ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.username && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.email ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.email && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: '100%',
                padding: '0.5rem',
                paddingRight: '3rem',
                border: errors.password ? '2px solid #d32f2f' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Confirm Password *
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.confirmPassword ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.confirmPassword && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Age */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.age ? '2px solid #d32f2f' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.age && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.age}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginRight: '0.5rem' }}
            />
            I accept the terms and conditions *
          </label>
          {errors.acceptTerms && (
            <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.acceptTerms}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
```

---

## Best Practices

### 1. Use Controlled Components
Always keep form state in React, not the DOM.

### 2. Validate Appropriately
- **Required fields**: Validate on blur or submit
- **Format validation** (email, phone): Validate on blur
- **Password strength**: Show feedback as user types
- **Matching fields**: Validate when both fields have values

### 3. Provide Clear Feedback
- Show errors clearly near the relevant field
- Use color and icons to indicate status
- Provide helpful error messages

### 4. Disable Submit When Invalid
Prevent submission when form has errors or is being submitted.

### 5. Handle Loading States
Show loading indicators during form submission.

### 6. Reset Form After Success
Clear the form after successful submission.

### 7. Prevent Double Submission
Disable submit button while form is being submitted.

### 8. Use Semantic HTML
Use proper input types (`email`, `tel`, `number`) for better mobile experience.

### 9. Accessibility
- Use labels for all inputs
- Provide error messages that screen readers can announce
- Use proper ARIA attributes

### 10. Keep It Simple
Don't over-validate. Only validate what's necessary.

---

## Common Patterns

### Custom Hook for Form Management

```jsx
import { useState } from 'react';

function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (!validationRules[name]) return '';
    
    for (const rule of validationRules[name]) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, newValue)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    return newErrors;
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();

    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const newErrors = validateAll();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      callback(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}

// Usage
function MyForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    { email: '', password: '' },
    {
      email: [
        (value) => !value ? 'Email is required' : '',
        (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email' : ''
      ],
      password: [
        (value) => !value ? 'Password is required' : '',
        (value) => value.length < 8 ? 'Password must be 8+ characters' : ''
      ]
    }
  );

  const onSubmit = (data) => {
    console.log('Form data:', data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <p>{errors.email}</p>}
      
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <p>{errors.password}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Practice Exercises

### Exercise 1: Login Form
Create a login form with:
- Email field (required, valid email)
- Password field (required, min 6 characters)
- "Remember me" checkbox
- Submit button
- Show/hide password toggle
- Display errors on blur
- Disable submit if form is invalid

### Exercise 2: Survey Form
Create a survey form with:
- Name (required)
- Email (required, valid email)
- Age (required, 13-100)
- Gender (radio buttons)
- Interests (checkboxes for multiple selection)
- Comments (textarea, optional)
- Rating (1-5 stars)
- Validate on submit
- Show summary of errors at top

### Exercise 3: Shipping Address Form
Create a shipping address form with:
- Full name (required)
- Street address (required)
- City (required)
- State/Province (dropdown)
- ZIP/Postal code (required, validate format)
- Country (dropdown)
- Phone number (optional, validate if provided)
- "Same as billing address" checkbox
- Real-time validation as user types

### Exercise 4: Password Change Form
Create a password change form with:
- Current password (required)
- New password (required, min 8 chars, must include uppercase, lowercase, number)
- Confirm new password (required, must match)
- Password strength indicator
- Show password requirements
- Validate new password doesn't match current password
- Success message on successful change

### Exercise 5: Multi-step Form
Create a multi-step registration form:
- Step 1: Personal info (name, email, phone)
- Step 2: Account details (username, password)
- Step 3: Preferences (interests, notifications)
- Step 4: Review and confirm
- Validate each step before proceeding
- Allow going back to edit
- Show progress indicator

---

## Summary

You've learned:
- ✅ Controlled components and how they work
- ✅ Handling multiple inputs efficiently
- ✅ Different validation strategies (onChange, onBlur, onSubmit)
- ✅ Displaying error messages effectively
- ✅ Form submission handling with loading states
- ✅ Building complete, real-world forms
- ✅ Creating reusable form components and hooks
- ✅ Best practices for forms in React

### Next Steps
1. Practice building different types of forms
2. Explore form libraries like Formik or React Hook Form
3. Learn about advanced validation (async validation, server-side validation)
4. Implement accessibility features in forms
5. Study file upload handling in forms

Keep practicing, and forms will become second nature! 🚀
