# React Hook Form: Complete Tutorial

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [useForm Hook](#useform-hook)
4. [register Method](#register-method)
5. [Form Validation Rules](#form-validation-rules)
6. [Error Handling](#error-handling)
7. [Custom Validation](#custom-validation)
8. [watch and setValue](#watch-and-setvalue)
9. [Integration with UI Libraries](#integration-with-ui-libraries)
10. [Advanced Patterns](#advanced-patterns)

## Introduction

React Hook Form is a performant, flexible, and extensible library for building forms in React with easy-to-use validation. It minimizes re-renders and provides a simple API for form state management.

### Key Benefits
- Minimizes re-renders for better performance
- Reduces the amount of code you need to write
- Isolated component re-renders
- Built-in validation with easy error handling
- Tiny size with no dependencies

## Installation

```bash
npm install react-hook-form
# or
yarn add react-hook-form
```

## useForm Hook

The `useForm` hook is the core of React Hook Form. It returns methods and state for managing your form.

### Basic Usage

```jsx
import { useForm } from 'react-hook-form';

function BasicForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### useForm Configuration Options

```jsx
const {
  register,
  handleSubmit,
  watch,
  setValue,
  getValues,
  reset,
  formState: { errors, isSubmitting, isDirty, isValid }
} = useForm({
  mode: 'onChange',           // Validation strategy
  reValidateMode: 'onChange', // Re-validation strategy
  defaultValues: {            // Default form values
    firstName: '',
    lastName: '',
    email: ''
  },
  criteriaMode: 'all',        // Show all errors or first error
  shouldFocusError: true      // Auto-focus on first error
});
```

### Validation Modes

```jsx
// onSubmit - Validation triggers on submit
useForm({ mode: 'onSubmit' })

// onBlur - Validation triggers on blur event
useForm({ mode: 'onBlur' })

// onChange - Validation triggers on change event
useForm({ mode: 'onChange' })

// onTouched - Validation triggers on first blur, then on change
useForm({ mode: 'onTouched' })

// all - Validation triggers on both blur and change
useForm({ mode: 'all' })
```

## register Method

The `register` method allows you to register an input and apply validation rules.

### Basic Registration

```jsx
function RegistrationExample() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} />
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
```

### Register with Validation

```jsx
function ValidatedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters'
          }
        })}
      />
      {errors.username && <p>{errors.username.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Form Validation Rules

React Hook Form supports various built-in validation rules.

### Built-in Validation Rules

```jsx
function ValidationRules() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {/* Required */}
      <input
        {...register('requiredField', {
          required: 'This field is required'
        })}
      />

      {/* Min/Max Length */}
      <input
        {...register('username', {
          minLength: { value: 3, message: 'Min length is 3' },
          maxLength: { value: 20, message: 'Max length is 20' }
        })}
      />

      {/* Min/Max Value (for numbers) */}
      <input
        type="number"
        {...register('age', {
          min: { value: 18, message: 'Must be at least 18' },
          max: { value: 100, message: 'Must be less than 100' }
        })}
      />

      {/* Pattern (Regex) */}
      <input
        {...register('email', {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
      />

      {/* Validate function */}
      <input
        {...register('confirmPassword', {
          validate: (value) => 
            value === password || 'Passwords do not match'
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Complete Registration Form Example

```jsx
function RegistrationForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password');

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        <input
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Min 3 characters' },
            maxLength: { value: 20, message: 'Max 20 characters' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Only letters, numbers and underscores'
            }
          })}
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Min 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Must contain uppercase, lowercase and number'
            }
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm password',
            validate: (value) =>
              value === password || 'Passwords do not match'
          })}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      </div>

      <div>
        <label>Age</label>
        <input
          type="number"
          {...register('age', {
            required: 'Age is required',
            min: { value: 18, message: 'Must be 18 or older' },
            max: { value: 120, message: 'Invalid age' }
          })}
        />
        {errors.age && <span>{errors.age.message}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
```

## Error Handling

React Hook Form provides comprehensive error handling capabilities.

### Displaying Errors

```jsx
function ErrorDisplay() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email'
          }
        })}
      />
      
      {/* Simple error display */}
      {errors.email && <p>{errors.email.message}</p>}
      
      {/* Error with type checking */}
      {errors.email?.type === 'required' && <p>Email is required</p>}
      {errors.email?.type === 'pattern' && <p>Invalid email format</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### ErrorMessage Component

```jsx
import { ErrorMessage } from '@hookform/error-message';

function ErrorMessageExample() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email'
          }
        })}
      />
      
      <ErrorMessage
        errors={errors}
        name="email"
        render={({ message }) => <p className="error">{message}</p>}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Multiple Errors (criteriaMode)

```jsx
function MultipleErrors() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    criteriaMode: 'all' // Show all validation errors
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Min 3 characters' },
          maxLength: { value: 20, message: 'Max 20 characters' },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Only alphanumeric and underscore'
          }
        })}
      />
      
      {errors.username && errors.username.types && (
        <ul>
          {Object.entries(errors.username.types).map(([type, message]) => (
            <li key={type}>{message}</li>
          ))}
        </ul>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form State for Error Styling

```jsx
function StyledErrors() {
  const { register, handleSubmit, formState: { errors, touchedFields } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('email', { required: true })}
        className={errors.email ? 'input-error' : ''}
        style={{
          borderColor: errors.email ? 'red' : 
                       touchedFields.email ? 'green' : 'gray'
        }}
      />
      {errors.email && <span className="error-text">Email is required</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Custom Validation

Create custom validation functions for complex validation logic.

### Simple Custom Validation

```jsx
function CustomValidation() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const isValidUsername = (value) => {
    const forbiddenWords = ['admin', 'root', 'system'];
    return !forbiddenWords.includes(value.toLowerCase()) || 
           'This username is not allowed';
  };

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Username is required',
          validate: isValidUsername
        })}
      />
      {errors.username && <p>{errors.username.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Multiple Custom Validators

```jsx
function MultipleValidators() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const validateUsername = {
    noSpaces: (value) => !/\s/.test(value) || 'No spaces allowed',
    noSpecialChars: (value) => 
      /^[a-zA-Z0-9_]+$/.test(value) || 'Only letters, numbers, underscore',
    notReserved: (value) => {
      const reserved = ['admin', 'root', 'moderator'];
      return !reserved.includes(value.toLowerCase()) || 'Reserved username';
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Username is required',
          validate: validateUsername
        })}
      />
      {errors.username && <p>{errors.username.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Async Validation

```jsx
function AsyncValidation() {
  const { register, handleSubmit, formState: { errors, isValidating } } = useForm();

  const checkUsernameAvailability = async (username) => {
    // Simulate API call
    const response = await fetch(`/api/check-username?username=${username}`);
    const data = await response.json();
    return data.available || 'Username already taken';
  };

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Username is required',
          validate: checkUsernameAvailability
        })}
      />
      {isValidating && <span>Checking availability...</span>}
      {errors.username && <p>{errors.username.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Cross-field Validation

```jsx
function CrossFieldValidation() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password');
  const startDate = watch('startDate');

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Min 8 characters' }
        })}
        placeholder="Password"
      />

      <input
        type="password"
        {...register('confirmPassword', {
          required: 'Please confirm password',
          validate: (value) =>
            value === password || 'Passwords must match'
        })}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <input
        type="date"
        {...register('startDate', { required: 'Start date required' })}
      />

      <input
        type="date"
        {...register('endDate', {
          required: 'End date required',
          validate: (value) =>
            new Date(value) > new Date(startDate) ||
            'End date must be after start date'
        })}
      />
      {errors.endDate && <p>{errors.endDate.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## watch and setValue

### watch - Monitor Input Values

```jsx
function WatchExample() {
  const { register, watch } = useForm();

  // Watch single field
  const username = watch('username');

  // Watch multiple fields
  const { firstName, lastName } = watch(['firstName', 'lastName']);

  // Watch all fields
  const allValues = watch();

  return (
    <div>
      <input {...register('username')} placeholder="Username" />
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      
      <div>
        <p>Username: {username}</p>
        <p>Full Name: {firstName} {lastName}</p>
        <pre>{JSON.stringify(allValues, null, 2)}</pre>
      </div>
    </div>
  );
}
```

### watch with Callback

```jsx
function WatchCallback() {
  const { register, watch } = useForm();
  const [submittedData, setSubmittedData] = useState(null);

  // Watch with callback
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('Field changed:', name, 'Type:', type, 'Value:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form>
      <input {...register('email')} placeholder="Email" />
      <input {...register('phone')} placeholder="Phone" />
    </form>
  );
}
```

### Conditional Rendering with watch

```jsx
function ConditionalFields() {
  const { register, watch, handleSubmit } = useForm();
  
  const showAdditionalFields = watch('hasAdditionalInfo');
  const userType = watch('userType');

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <select {...register('userType')}>
        <option value="">Select type</option>
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>

      {userType === 'individual' && (
        <input {...register('ssn')} placeholder="SSN" />
      )}

      {userType === 'business' && (
        <input {...register('ein')} placeholder="EIN" />
      )}

      <label>
        <input type="checkbox" {...register('hasAdditionalInfo')} />
        Add additional information
      </label>

      {showAdditionalFields && (
        <div>
          <input {...register('additionalField1')} placeholder="Field 1" />
          <input {...register('additionalField2')} placeholder="Field 2" />
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### setValue - Programmatic Value Updates

```jsx
function SetValueExample() {
  const { register, setValue, handleSubmit, watch } = useForm();
  
  const country = watch('country');

  const handleCountryChange = (selectedCountry) => {
    setValue('country', selectedCountry);
    
    // Set related fields
    if (selectedCountry === 'USA') {
      setValue('currency', 'USD');
      setValue('timezone', 'EST');
    } else if (selectedCountry === 'UK') {
      setValue('currency', 'GBP');
      setValue('timezone', 'GMT');
    }
  };

  const populateTestData = () => {
    setValue('firstName', 'John');
    setValue('lastName', 'Doe');
    setValue('email', 'john@example.com');
    setValue('country', 'USA');
  };

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <input {...register('email')} placeholder="Email" />
      
      <select {...register('country')} onChange={(e) => handleCountryChange(e.target.value)}>
        <option value="">Select Country</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
      </select>
      
      <input {...register('currency')} placeholder="Currency" readOnly />
      <input {...register('timezone')} placeholder="Timezone" readOnly />
      
      <button type="button" onClick={populateTestData}>
        Fill Test Data
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### setValue Options

```jsx
function SetValueOptions() {
  const { register, setValue } = useForm();

  const handleUpdate = () => {
    // Default behavior
    setValue('username', 'newValue');

    // Validate after setting
    setValue('email', 'test@example.com', { 
      shouldValidate: true 
    });

    // Mark as dirty
    setValue('phone', '1234567890', { 
      shouldDirty: true 
    });

    // Mark as touched
    setValue('address', '123 Main St', { 
      shouldTouch: true 
    });

    // All options
    setValue('city', 'New York', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <form>
      <input {...register('username')} />
      <input {...register('email')} />
      <input {...register('phone')} />
      <input {...register('address')} />
      <input {...register('city')} />
      <button type="button" onClick={handleUpdate}>Update</button>
    </form>
  );
}
```

## Integration with UI Libraries

### Material-UI Integration

```jsx
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

function MaterialUIForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{ required: 'Username is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Username"
            variant="outlined"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />

      <Controller
        name="agreeToTerms"
        control={control}
        defaultValue={false}
        rules={{ required: 'You must agree to terms' }}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="I agree to terms and conditions"
          />
        )}
      />
      {errors.agreeToTerms && <p>{errors.agreeToTerms.message}</p>}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
```

### React Select Integration

```jsx
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';

function ReactSelectForm() {
  const { control, handleSubmit } = useForm();

  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' }
  ];

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="framework"
        control={control}
        rules={{ required: 'Please select a framework' }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Select
              {...field}
              options={options}
              placeholder="Select framework"
            />
            {error && <p>{error.message}</p>}
          </div>
        )}
      />

      <Controller
        name="languages"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            placeholder="Select multiple"
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Chakra UI Integration

```jsx
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

function ChakraUIForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormControl isInvalid={errors.username}>
        <FormLabel>Username</FormLabel>
        <Input
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Min 3 characters' }
          })}
          placeholder="Enter username"
        />
        <FormErrorMessage>
          {errors.username && errors.username.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email'
            }
          })}
          placeholder="Enter email"
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue">
        Submit
      </Button>
    </form>
  );
}
```

### Ant Design Integration

```jsx
import { Form, Input, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';

function AntDesignForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <Form onFinish={handleSubmit((data) => console.log(data))} layout="vertical">
      <Form.Item
        label="Username"
        validateStatus={errors.username ? 'error' : ''}
        help={errors.username?.message}
      >
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Username is required',
            minLength: { value: 3, message: 'Min 3 characters' }
          }}
          render={({ field }) => <Input {...field} placeholder="Username" />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email'
            }
          }}
          render={({ field }) => <Input {...field} type="email" placeholder="Email" />}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## Advanced Patterns

### Dynamic Form Fields

```jsx
import { useForm, useFieldArray } from 'react-hook-form';

function DynamicForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      users: [{ name: '', email: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`users.${index}.name`, { required: true })}
            placeholder="Name"
          />
          <input
            {...register(`users.${index}.email`, { required: true })}
            placeholder="Email"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ name: '', email: '' })}
      >
        Add User
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form Reset

```jsx
function FormReset() {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: {
      username: '',
      email: ''
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    reset(); // Reset to default values
  };

  const resetToCustomValues = () => {
    reset({
      username: 'admin',
      email: 'admin@example.com'
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      <input {...register('email')} />
      
      <button type="submit">Submit</button>
      <button type="button" onClick={() => reset()}>Reset</button>
      <button type="button" onClick={resetToCustomValues}>
        Reset to Admin
      </button>
      
      {isDirty && <p>Form has been modified</p>}
    </form>
  );
}
```

### Submission State

```jsx
function SubmissionState() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, isValid }
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      
      <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      
      {isSubmitSuccessful && <p>Form submitted successfully!</p>}
    </form>
  );
}
```

### Schema Validation (Yup)

```bash
npm install @hookform/resolvers yup
```

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Min 3 characters')
    .max(20, 'Max 20 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email'),
  age: yup.number()
    .required('Age is required')
    .positive('Must be positive')
    .integer('Must be an integer')
    .min(18, 'Must be 18 or older'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number'),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match')
}).required();

function YupValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="number" {...register('age')} />
      {errors.age && <p>{errors.age.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Schema Validation (Zod)

```bash
npm install @hookform/resolvers zod
```

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string()
    .min(3, 'Min 3 characters')
    .max(20, 'Max 20 characters'),
  email: z.string()
    .email('Invalid email'),
  age: z.number()
    .min(18, 'Must be 18 or older')
    .max(120, 'Invalid age'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

function ZodValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age && <p>{errors.age.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Best Practices

1. **Use TypeScript for type safety**
```typescript
interface FormData {
  username: string;
  email: string;
  age: number;
}

const { register, handleSubmit } = useForm<FormData>();
```

2. **Leverage defaultValues for better UX**
```jsx
const { register } = useForm({
  defaultValues: {
    country: 'USA',
    notifications: true
  }
});
```

3. **Use mode wisely**
- Use `onSubmit` for simple forms
- Use `onChange` or `onBlur` for better UX on complex forms

4. **Optimize re-renders with watch**
```jsx
// Instead of watching all values
const allValues = watch();

// Watch specific fields
const username = watch('username');
```

5. **Use Controller for third-party UI components**

6. **Implement proper error handling**
```jsx
const onSubmit = async (data) => {
  try {
    await api.submit(data);
  } catch (error) {
    setError('root', { message: 'Submission failed' });
  }
};
```

## Conclusion

React Hook Form provides a powerful, performant way to handle forms in React applications. Key takeaways:

- Minimal re-renders for better performance
- Easy validation with built-in and custom rules
- Flexible error handling
- Seamless integration with UI libraries
- Support for complex validation schemas
- Dynamic form capabilities

For more information, visit the [official documentation](https://react-hook-form.com/).
