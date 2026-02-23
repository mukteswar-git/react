# Phase 7: Styling Solutions — Component Libraries

> **Chapter Goal:** Understand what component libraries are, learn the essentials of the most popular ones, and know when (and when *not*) to reach for them.

---

## Table of Contents

1. [What Are Component Libraries?](#what-are-component-libraries)
2. [shadcn/ui (Recommended)](#shadcnui-recommended)
3. [Material-UI Basics](#material-ui-basics)
4. [Chakra UI Basics](#chakra-ui-basics)
5. [When to Use Component Libraries](#when-to-use-component-libraries)
6. [Comparison at a Glance](#comparison-at-a-glance)
7. [Exercises](#exercises)

---

## What Are Component Libraries?

A **component library** is a collection of pre-built, reusable UI components — buttons, modals, forms, dropdowns, tables — that you drop into your project instead of building from scratch.

They typically handle:

- Consistent styling across your app
- Accessibility (ARIA roles, keyboard navigation)
- Responsive behavior
- Dark mode support
- Animation and transitions

Think of them as a head start: instead of spending days perfecting a date-picker, you install one that's already battle-tested by thousands of developers.

---

## shadcn/ui (Recommended)

### What Makes shadcn/ui Different?

Unlike traditional libraries where you `npm install` a package and import components, **shadcn/ui is a collection of copy-paste components** built on top of [Radix UI](https://www.radix-ui.com/) primitives and styled with [Tailwind CSS](https://tailwindcss.com/).

> **Key insight:** You own the code. Components live in your `/components/ui` folder — you can read, edit, and extend every single line.

### Installation

```bash
# Create a new Next.js app (shadcn/ui works best with Next.js or Vite + React)
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app

# Initialize shadcn/ui
npx shadcn@latest init
```

During `init`, you'll be asked:

- Which style? → `Default` or `New York`
- Which base color? → e.g., `Slate`, `Zinc`, `Stone`
- Do you want CSS variables? → `Yes` (recommended)

### Adding Components

You add components one at a time, on demand:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
```

Each command copies the component source into `components/ui/`.

### Using Components

```tsx
// app/page.tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Get started with shadcn/ui</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your content goes here.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
```

### Button Variants

```tsx
import { Button } from "@/components/ui/button"

// Available variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>
```

### Dialog (Modal) Example

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DeleteConfirmation() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Yes, delete it</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Form with Validation

shadcn/ui pairs perfectly with `react-hook-form` and `zod`:

```bash
npm install react-hook-form zod @hookform/resolvers
npx shadcn@latest add form input label
```

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
```

### Customizing Components

Because the code lives in your project, customization is straightforward — just edit the file:

```tsx
// components/ui/button.tsx
// Change the default variant to use your brand color
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "bg-brand-600 text-white hover:bg-brand-700", // ← your color
        // ...
      }
    }
  }
)
```

### shadcn/ui Pros & Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Full ownership of component code | More initial setup than `npm install` |
| Easy to customize | Requires Tailwind CSS |
| Excellent accessibility (Radix UI) | Less "out of the box" than MUI |
| Lightweight — only ship what you use | Relatively newer ecosystem |
| Works great with Next.js App Router | |

---

## Material-UI Basics

[Material-UI (MUI)](https://mui.com/) is one of the oldest and most mature React component libraries, implementing Google's Material Design specification.

### Installation

```bash
npm install @mui/material @emotion/react @emotion/styled
# Optional: MUI icons
npm install @mui/icons-material
```

### Basic Usage

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function LoginForm() {
  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto', mt: 8 }}
    >
      <Typography variant="h4" component="h1">
        Sign In
      </Typography>
      <TextField label="Email" type="email" fullWidth />
      <TextField label="Password" type="password" fullWidth />
      <Button variant="contained" size="large" fullWidth>
        Sign In
      </Button>
    </Box>
  )
}
```

### The `sx` Prop

MUI uses the `sx` prop as an escape hatch for one-off styles. It supports shorthand properties:

```tsx
<Box
  sx={{
    // Spacing (theme multiples of 8px)
    p: 2,         // padding: 16px
    mt: 4,        // margin-top: 32px
    px: { xs: 2, md: 4 },  // responsive padding

    // Colors
    bgcolor: 'primary.main',
    color: 'white',

    // Layout
    display: 'flex',
    alignItems: 'center',
    gap: 2,

    // Typography
    fontSize: { xs: '1rem', md: '1.25rem' },
  }}
>
```

### Theming with MUI

```tsx
// theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // your brand color
    },
    secondary: {
      main: '#ec4899',
    },
    mode: 'light', // or 'dark'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
  },
  shape: {
    borderRadius: 8,
  },
})

export default theme
```

```tsx
// app/layout.tsx (or _app.tsx in Pages Router)
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Normalizes browser styles */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Commonly Used MUI Components

```tsx
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'

// Alerts
<Alert severity="success">Changes saved!</Alert>
<Alert severity="error">Something went wrong.</Alert>
<Alert severity="warning">Check your input.</Alert>
<Alert severity="info">New version available.</Alert>

// Loading
<CircularProgress size={24} />
<Skeleton variant="rectangular" width={200} height={100} />

// Tags
<Chip label="React" color="primary" />
<Chip label="TypeScript" variant="outlined" onDelete={() => {}} />
```

### MUI Data Grid (Tables)

```bash
npm install @mui/x-data-grid
```

```tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250, flex: 1 },
]

const rows = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]

export function UsersTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
    </div>
  )
}
```

### MUI Pros & Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Extremely mature & well-documented | Opinionated Material Design look |
| Rich ecosystem (Date Pickers, Data Grid, Charts) | Large bundle size |
| Strong TypeScript support | Hard to deviate from the design system |
| Handles complex components (tree views, data grids) | `sx` prop can get verbose |
| Large community | Not Tailwind-compatible |

---

## Chakra UI Basics

[Chakra UI](https://v2.chakra-ui.com/) strikes a balance between flexibility and convenience. Its component API is prop-driven, making it very readable and quick to prototype with.

### Installation

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Setup

```tsx
// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Basic Layout

Chakra's style props map directly to CSS properties, making layouts very readable:

```tsx
import { Box, Flex, Stack, VStack, HStack, Grid, GridItem } from '@chakra-ui/react'
import { Text, Heading, Button, Input, Badge } from '@chakra-ui/react'

export function ProfileCard() {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      boxShadow="md"
    >
      <VStack align="start" spacing={4}>
        <HStack>
          <Heading size="md">Jane Doe</Heading>
          <Badge colorScheme="green">Pro</Badge>
        </HStack>
        <Text color="gray.600">Full-stack developer based in Berlin.</Text>
        <HStack spacing={3}>
          <Button colorScheme="blue" size="sm">Follow</Button>
          <Button variant="outline" size="sm">Message</Button>
        </HStack>
      </VStack>
    </Box>
  )
}
```

### Style Props Reference

```tsx
// Chakra style props map to CSS properties
<Box
  // Spacing
  m={4}           // margin: 1rem
  p="20px"        // padding: 20px
  px={8}          // padding-left + right: 2rem
  py={{ base: 4, md: 8 }}  // responsive

  // Colors
  bg="blue.500"   // background-color
  color="white"

  // Typography
  fontSize="xl"
  fontWeight="bold"
  textAlign="center"

  // Layout
  display="flex"
  flexDir="column"
  w="full"        // width: 100%
  maxW="container.md"

  // Borders
  border="1px solid"
  borderColor="gray.200"
  borderRadius="md"

  // Effects
  boxShadow="lg"
  opacity={0.8}

  // Pseudo-states
  _hover={{ bg: 'blue.600', transform: 'scale(1.02)' }}
  _focus={{ outline: 'none', ring: 2, ringColor: 'blue.400' }}
  transition="all 0.2s"
/>
```

### Forms in Chakra UI

```tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const isError = email === '' && email !== undefined

  return (
    <VStack as="form" spacing={4} maxW="md" mx="auto">
      <FormControl isRequired isInvalid={isError}>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {!isError ? (
          <FormHelperText>We'll never share your email.</FormHelperText>
        ) : (
          <FormErrorMessage>Email is required.</FormErrorMessage>
        )}
      </FormControl>
      <Button type="submit" colorScheme="teal" width="full">
        Create Account
      </Button>
    </VStack>
  )
}
```

### Chakra Theming

```tsx
// theme.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      900: '#4c1d95',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

export default theme
```

### Dark Mode with Chakra

Chakra has built-in dark mode support through `useColorMode` and `useColorModeValue`:

```tsx
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export function ColorModeToggle() {
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />)

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={icon}
      onClick={toggleColorMode}
      variant="ghost"
    />
  )
}

// Use different values based on current mode
function ThemedCard() {
  const bg = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('gray.800', 'white')

  return (
    <Box bg={bg} color={color} p={6} borderRadius="lg">
      This card adapts to dark mode automatically.
    </Box>
  )
}
```

### Chakra UI Pros & Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Very readable style props API | Heavier than shadcn/ui |
| Excellent built-in dark mode | Not using Tailwind (different mental model) |
| Great for rapid prototyping | Framer Motion dependency adds weight |
| Good accessibility defaults | Customization can get complex |
| Clean, consistent design out of the box | Less popular in 2024+ compared to shadcn |

---

## When to Use Component Libraries

Choosing between a component library and writing your own styles is one of the most important architectural decisions you'll make. Here's a framework to guide you.

### ✅ Use a Component Library When...

**You need to ship fast.** Component libraries give you production-ready buttons, forms, modals, and data tables in minutes. Perfect for MVPs, internal tools, admin dashboards, and prototypes.

**Accessibility is non-negotiable.** Libraries like shadcn/ui (via Radix UI) and Chakra UI have professionally audited ARIA implementations. Building accessible modals and dropdowns from scratch is surprisingly hard.

**Your team lacks a dedicated designer.** Component libraries provide a coherent design system for free. Your app will look polished even with a small team.

**You're building a CRUD-heavy app.** Form components, data tables, and validation are already solved. Don't reinvent this wheel.

**You want consistency across a large codebase.** Libraries enforce visual and behavioral consistency far better than ad-hoc styling.

### ❌ Skip a Component Library When...

**You have a highly custom design.** If your designer has pixel-perfect mockups that don't match any library's design language, fighting against a library's defaults is painful. Custom CSS or Tailwind from scratch may be faster.

**You're building something extremely performance-sensitive.** Some libraries (MUI especially) have large bundle sizes. For a content site where milliseconds matter, hand-written CSS or Tailwind utilities win.

**You're learning CSS fundamentals.** If you're early in your frontend journey, using a component library can hide important concepts. Build a few projects with raw CSS first.

**The library's design language conflicts with your brand.** MUI apps can look unmistakably "Material." If your brand needs something distinctive, the library may work against you.

**You need a single, highly specialized component.** If you only need a custom date picker, install just that package (e.g., `react-day-picker`) rather than an entire design system.

### Decision Framework

```
Do you have a designer-created design system?
├── Yes → Consider Tailwind + shadcn/ui (you own the components)
│          or raw CSS/CSS Modules for maximum fidelity
└── No  → Is this an internal tool / admin panel?
          ├── Yes → MUI or Chakra (batteries included, good enough look)
          └── No  → shadcn/ui (polished, customizable, modern)
```

### Mixing Approaches

You don't have to choose just one strategy. Many production apps use:

- A **component library** for complex interactive components (modals, dropdowns, date pickers)
- **Tailwind utilities** for layout, spacing, and typography
- **Custom CSS** for truly unique animations or branded elements

```tsx
// Totally valid: shadcn/ui Dialog + custom Tailwind layout
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function CustomModal() {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-violet-50 to-indigo-50">
        {/* shadcn/ui handles accessibility, you handle the look */}
        <div className="grid grid-cols-2 gap-6 p-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Custom Layout</h3>
            <p className="text-sm text-slate-600">Your design, their accessibility.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Comparison at a Glance

| | shadcn/ui | Material-UI | Chakra UI |
|---|---|---|---|
| **Style system** | Tailwind CSS | Emotion / sx prop | Emotion / style props |
| **Customizability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Bundle size** | 🟢 Minimal (tree-shaken) | 🔴 Large | 🟡 Medium |
| **Accessibility** | ⭐⭐⭐⭐⭐ (Radix UI) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Dark mode** | Manual (easy) | Built-in | Built-in |
| **Learning curve** | Low–Medium | Medium | Low |
| **Best for** | Modern apps, design systems | Enterprise, dashboards | Rapid prototyping |
| **Ecosystem maturity** | Growing fast | Very mature | Mature |
| **TypeScript support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Exercises

### Exercise 1 — shadcn/ui Quickstart

1. Create a new Next.js app and initialize shadcn/ui.
2. Add the `button`, `card`, `input`, and `badge` components.
3. Build a "Product Card" showing an image placeholder, title, price, and an "Add to Cart" button.
4. Add a `Dialog` that appears when clicking "Add to Cart" to confirm the action.

### Exercise 2 — MUI Theming

1. Create a React + MUI app.
2. Define a custom theme with your own primary color and custom `Inter` font.
3. Apply the theme via `ThemeProvider`.
4. Build a settings page using `TextField`, `Select`, `Switch`, and a `Button` to save.

### Exercise 3 — Chakra Dark Mode

1. Set up a Chakra UI project with dark mode support.
2. Create a navbar that includes a `ColorModeToggle` button.
3. Build a card component that uses `useColorModeValue` to switch between light and dark background colors.
4. Verify that toggling color mode updates all components immediately.

### Exercise 4 — The Right Tool

Given the following scenarios, decide which approach you'd use and write a brief justification:

- A startup's landing page with a unique brand identity
- An internal HR dashboard showing employee data tables
- A design agency's portfolio site
- A SaaS app's settings/account page
- A company's public documentation site

---

## Summary

| Concept | Key Takeaway |
|---|---|
| **shadcn/ui** | Copy-paste components you own; ideal for modern, customizable apps |
| **Material-UI** | Mature, feature-rich, but opinionated; best for enterprise dashboards |
| **Chakra UI** | Fast prototyping, readable API, great dark mode |
| **When to use** | Default to libraries for speed & accessibility; go custom for unique designs |
| **Mixing** | Libraries + Tailwind + custom CSS is a perfectly valid, common strategy |

---

*Next up → **Phase 7 Continued:** Advanced Tailwind techniques, CSS-in-JS deep dive, and design tokens.*
