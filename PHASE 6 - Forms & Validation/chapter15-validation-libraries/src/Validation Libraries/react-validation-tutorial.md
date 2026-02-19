# React Validation Libraries: A Complete Tutorial

A comprehensive guide to **Zod**, **Yup**, and their integration with **React Hook Form**.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Zod — Schema Validation](#zod)
3. [Yup — Alternative Schema Validation](#yup)
4. [React Hook Form](#react-hook-form)
5. [Zod + React Hook Form](#zod--react-hook-form)
6. [Yup + React Hook Form](#yup--react-hook-form)
7. [Zod vs Yup — Comparison](#zod-vs-yup-comparison)
8. [Advanced Patterns](#advanced-patterns)
9. [Best Practices](#best-practices)

---

## Introduction

Validation is a critical part of any form-heavy React application. This tutorial covers:

- **Zod** — A TypeScript-first schema declaration and validation library
- **Yup** — A JavaScript schema builder for value parsing and validation
- **React Hook Form** — Performant, flexible form state management that integrates seamlessly with both

### Installation

```bash
# React Hook Form
npm install react-hook-form

# Zod + resolver
npm install zod @hookform/resolvers

# Yup + resolver
npm install yup @hookform/resolvers
```

---

## Zod

Zod is TypeScript-first and infers static types from your schemas — eliminating the need to define types separately.

### Basic Schema Definition

```ts
import { z } from 'zod';

// Primitive types
const nameSchema = z.string().min(2).max(50);
const ageSchema = z.number().int().positive();
const emailSchema = z.string().email();

// Object schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18'),
  website: z.string().url().optional(),
});

// Infer the TypeScript type
type User = z.infer<typeof userSchema>;
// { name: string; email: string; age: number; website?: string }
```

### Common Validators

```ts
import { z } from 'zod';

const schema = z.object({
  // Strings
  username: z.string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),

  // Numbers
  price: z.number().positive('Must be positive').multipleOf(0.01),

  // Enums
  role: z.enum(['admin', 'user', 'moderator']),

  // Arrays
  tags: z.array(z.string()).min(1).max(5),

  // Dates
  birthDate: z.date().max(new Date(), 'Cannot be in the future'),

  // Booleans
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),

  // Optional vs nullable
  nickname: z.string().optional(),   // string | undefined
  middleName: z.string().nullable(), // string | null
});
```

### Custom Validation with `.refine()` and `.superRefine()`

```ts
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Error attaches to this field
});

// superRefine for multiple custom errors
const advancedSchema = z.string().superRefine((val, ctx) => {
  if (!val.includes('@')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must contain @',
    });
  }
  if (val.length < 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Too short',
    });
  }
});
```

### Transformations

```ts
const schema = z.object({
  // Transform input before validation
  age: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(18)),

  // Trim and lowercase email
  email: z.string().trim().toLowerCase().email(),
});
```

### Parsing Data

```ts
// parse() throws on failure
try {
  const user = userSchema.parse({ name: 'Alice', email: 'alice@example.com', age: 25 });
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(err.errors); // Array of validation errors
  }
}

// safeParse() returns a result object — preferred in most cases
const result = userSchema.safeParse({ name: 'Al', email: 'bad-email', age: 16 });

if (!result.success) {
  console.log(result.error.flatten());
  // {
  //   fieldErrors: { name: ['...'], email: ['...'], age: ['...'] },
  //   formErrors: []
  // }
} else {
  console.log(result.data); // Typed and validated User
}
```

---

## Yup

Yup is a battle-tested schema validation library with a fluent, chainable API. While not TypeScript-first, it has solid TypeScript support.

### Basic Schema Definition

```ts
import * as yup from 'yup';

const userSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  age: yup.number().min(18, 'Must be at least 18').required(),
  website: yup.string().url().optional(),
});

// Infer TypeScript type
type User = yup.InferType<typeof userSchema>;
```

### Common Validators

```ts
import * as yup from 'yup';

const schema = yup.object({
  // Strings
  username: yup.string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores')
    .required(),

  // Numbers
  price: yup.number().positive().required(),

  // Enums
  role: yup.string().oneOf(['admin', 'user', 'moderator']).required(),

  // Arrays
  tags: yup.array().of(yup.string()).min(1).max(5),

  // Dates
  birthDate: yup.date().max(new Date(), 'Cannot be in the future'),

  // Booleans
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms').required(),
});
```

### Custom Validation with `.test()`

```ts
const passwordSchema = yup.object({
  password: yup.string().min(8).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required(),
});

// Custom async validation
const usernameSchema = yup.string().test(
  'unique-username',
  'Username is already taken',
  async (value) => {
    if (!value) return true;
    const exists = await checkUsernameExists(value);
    return !exists;
  }
);
```

### Validation

```ts
// validate() — throws on failure
try {
  const user = await userSchema.validate({ name: 'Alice', email: 'alice@example.com', age: 25 });
} catch (err) {
  if (err instanceof yup.ValidationError) {
    console.log(err.message);  // First error message
    console.log(err.path);     // Field path
  }
}

// abortEarly: false — collect ALL errors, not just the first
try {
  await userSchema.validate(data, { abortEarly: false });
} catch (err) {
  if (err instanceof yup.ValidationError) {
    console.log(err.inner); // Array of all errors
  }
}

// isValid() — returns boolean
const isValid = await userSchema.isValid(data);
```

---

## React Hook Form

React Hook Form is a minimal, performant library for managing form state. It uses uncontrolled components under the hood, resulting in fewer re-renders.

### Basic Usage (Without Schema)

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await login(data); // Your submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

### Key API Reference

| API | Description |
|-----|-------------|
| `register(name, options)` | Register an input field |
| `handleSubmit(onSubmit)` | Wrap your submit handler |
| `formState.errors` | Object containing field errors |
| `formState.isSubmitting` | True during async submit |
| `formState.isValid` | True if form has no errors |
| `formState.isDirty` | True if any field has changed |
| `watch(name)` | Watch field value reactively |
| `setValue(name, value)` | Programmatically set a value |
| `reset()` | Reset form to defaults |
| `trigger(name)` | Manually trigger validation |

---

## Zod + React Hook Form

This is the most popular combination for TypeScript projects.

### Complete Registration Form Example

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema
const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// 2. Infer type from schema
type RegistrationForm = z.infer<typeof registrationSchema>;

// 3. Build the form
export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'user',
      agreeToTerms: false,
    },
  });

  const onSubmit: SubmitHandler<RegistrationForm> = async (data) => {
    try {
      await registerUser(data);
      reset();
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" {...register('firstName')} />
        {errors.firstName && <span className="error">{errors.firstName.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" {...register('lastName')} />
        {errors.lastName && <span className="error">{errors.lastName.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" {...register('role')}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <span className="error">{errors.role.message}</span>}
      </div>

      <div className="form-group">
        <label>
          <input type="checkbox" {...register('agreeToTerms')} />
          I agree to the Terms and Conditions
        </label>
        {errors.agreeToTerms && (
          <span className="error">{errors.agreeToTerms.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

## Yup + React Hook Form

### Complete Registration Form with Yup

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Define schema
const registrationSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('Required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Required'),
  email: yup.string().email('Please enter a valid email').required('Required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Required'),
  role: yup.string().oneOf(['user', 'admin']).required(),
  agreeToTerms: yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required(),
});

type RegistrationForm = yup.InferType<typeof registrationSchema>;

// 2. Build the form
export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationForm>({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit: SubmitHandler<RegistrationForm> = async (data) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Same JSX structure as the Zod example */}
    </form>
  );
}
```

---

## Zod vs Yup Comparison

| Feature | Zod | Yup |
|---------|-----|-----|
| TypeScript support | ✅ First-class (type inference) | ✅ Good (via `InferType`) |
| Bundle size | ~13 KB gzipped | ~17 KB gzipped |
| Async validation | ✅ Supported | ✅ Native support |
| Error messages | Customizable | Customizable |
| `.transform()` | ✅ Built-in | Limited |
| Coercion | `z.coerce.*` | Auto-coerces |
| Community size | Growing rapidly | Very mature |
| Learning curve | Low | Low |
| Cross-field validation | `.refine()` / `.superRefine()` | `.test()` + `yup.ref()` |

**Choose Zod if:** You're building a TypeScript-heavy project and want type safety to be the source of truth.

**Choose Yup if:** You're working on a JavaScript project, need deep async validation, or your team is already familiar with it.

---

## Advanced Patterns

### Conditional Validation

**With Zod:**

```ts
const schema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional(),
}).refine(
  data => !data.hasCompany || (data.hasCompany && !!data.companyName),
  {
    message: 'Company name is required when "Has Company" is checked',
    path: ['companyName'],
  }
);
```

**With Yup:**

```ts
const schema = yup.object({
  hasCompany: yup.boolean(),
  companyName: yup.string().when('hasCompany', {
    is: true,
    then: schema => schema.required('Company name is required'),
    otherwise: schema => schema.optional(),
  }),
});
```

### Dynamic / Multi-Step Forms

```tsx
const step1Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const step2Schema = z.object({
  address: z.string().min(5),
  city: z.string(),
});

const fullSchema = step1Schema.merge(step2Schema);
type FullForm = z.infer<typeof fullSchema>;

function MultiStepForm() {
  const [step, setStep] = useState(1);

  const { register, handleSubmit, trigger, formState: { errors } } =
    useForm<FullForm>({ resolver: zodResolver(fullSchema) });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? ['name', 'email'] : ['address', 'city'];
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => s + 1);
  };

  const onSubmit: SubmitHandler<FullForm> = (data) => {
    console.log('Final data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <>
          <input {...register('name')} placeholder="Name" />
          {errors.name && <p>{errors.name.message}</p>}
          <input {...register('email')} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}
          <button type="button" onClick={nextStep}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <input {...register('address')} placeholder="Address" />
          {errors.address && <p>{errors.address.message}</p>}
          <input {...register('city')} placeholder="City" />
          {errors.city && <p>{errors.city.message}</p>}
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  );
}
```

### Reusable Field Component

```tsx
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  rules?: RegisterOptions;
}

function FormField({ name, label, type = 'text' }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="error">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

// Usage with FormProvider
function MyForm() {
  const methods = useForm({ resolver: zodResolver(schema) });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField name="email" label="Email" type="email" />
        <FormField name="password" label="Password" type="password" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

### Server-Side Error Handling

```tsx
const { setError, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(schema) });

const onSubmit = async (data: FormValues) => {
  try {
    await submitForm(data);
  } catch (apiError: any) {
    // Map server errors back to form fields
    if (apiError.field) {
      setError(apiError.field, {
        type: 'server',
        message: apiError.message,
      });
    } else {
      setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
};

// Display root errors
{errors.root && <div className="alert error">{errors.root.message}</div>}
```

---

## Best Practices

**1. Define schemas outside components**

Keep schema definitions at module level to avoid recreation on every render.

```ts
// ✅ Good — defined once
const loginSchema = z.object({ ... });

function LoginForm() {
  const { ... } = useForm({ resolver: zodResolver(loginSchema) });
}
```

**2. Use `noValidate` on your `<form>`**

Disable native browser validation to let your schema library control all feedback.

```tsx
<form onSubmit={handleSubmit(onSubmit)} noValidate>
```

**3. Provide accessible errors**

```tsx
<input
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
  {...register('email')}
/>
{errors.email && (
  <p id="email-error" role="alert">{errors.email.message}</p>
)}
```

**4. Use `mode` for validation timing**

```ts
useForm({
  mode: 'onBlur',     // Validate on field blur (good UX default)
  // mode: 'onChange', // Validate on every keystroke
  // mode: 'onSubmit', // Validate only on submit (default)
  // mode: 'all',      // Validate on blur and change
  resolver: zodResolver(schema),
});
```

**5. Export schema types alongside schemas**

```ts
// schemas/user.ts
export const userSchema = z.object({ ... });
export type UserFormValues = z.infer<typeof userSchema>;
```

**6. Avoid over-validating on the client**

Client validation is UX — always re-validate on the server. Never trust client data alone.

---

## Summary

```
React Hook Form + Zod (TypeScript projects) ← Recommended
React Hook Form + Yup (JavaScript projects) ← Solid alternative
```

Both combinations give you:

- Schema-driven, centralized validation rules
- Automatic TypeScript types from your schema
- Excellent performance (minimal re-renders)
- Rich error handling including cross-field and server errors
- Easy extensibility with custom validators

Start with the Zod + React Hook Form combo for any new TypeScript project — the type inference alone pays for itself.
