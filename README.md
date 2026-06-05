# Taskly

Project management application built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint
```

## Project Structure

```
src/
├── api/              # API calls (authApi, userApi)
├── assets/           # Static assets (icons, images)
├── components/       # Reusable components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard components
│   └── ui/           # UI primitives (button, input, etc)
├── constants/        # App constants
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
│   └── validations/  # Zod validation schemas
├── pages/            # Page components
│   ├── auth/         # Auth pages (Login, Signup, etc)
│   └── dashboard/    # Dashboard pages
├── redux/            # Redux store and slices
├── router/           # Route configurations
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Key Features

### Authentication

- Login/Signup with email validation
- Password reset flow
- Remember me functionality
- Token-based authentication (access + refresh tokens)

### State Management

- **Redux Toolkit** with **Redux Thunk** for async operations
- **Authentication endpoints** (login/signup) use direct API calls for simplicity
- **User data management** uses Redux for global state across the app
- Typed hooks (`useAppDispatch`, `useAppSelector`) for type safety
- User slice with `fetchCurrentUserThunk()` for loading user data

### Form Validation

- React Hook Form for form handling
- Zod schemas for validation rules
- Password strength requirements

### API Layer

- **Direct API calls** for authentication (login, signup, password reset)
- **Redux Thunk** for user data that needs global state
- Centralized API configuration (`src/lib/api.ts`)
- Custom fetch wrapper with error handling (`src/lib/apiFetch.ts`)
- Token management with cookies (access + refresh tokens)

### API Calls Strategy

This project uses a **hybrid approach** for API calls:

**1. Direct API Calls (in components):**

- Authentication endpoints: `login`, `signup`, `forgotPassword`, `resetPassword`
- Simple, one-time operations that don't need global state
- Keeps auth flows straightforward without Redux complexity

**2. Redux Thunk (global state management):**

- `fetchCurrentUserThunk()` - Fetch and store user data globally
- User state that needs to be accessed across multiple components
- Handles loading states, errors, and success automatically

**Why this separation?**

- Authentication flows remain simple with direct API calls
- User data is managed globally with Redux for cross-component access
- Clear separation of concerns: auth actions vs. state management

---

## Redux Usage Guide

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUserThunk, logout } from '../redux/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading, error } = useAppSelector(state => state.user);

  // Fetch current user
  const loadUser = async () => {
    const result = await dispatch(fetchCurrentUserThunk());

    if (fetchCurrentUserThunk.fulfilled.match(result)) {
      console.log('User loaded:', result.payload);
    } else {
      console.error('Error:', result.payload);
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.name}</p>}
    </div>
  );
}
```

### Available User Actions

**Async Thunk (API Call):**

- `fetchCurrentUserThunk()` - Fetch current authenticated user data

**Synchronous Actions:**

- `setUser(user)` - Manually set user data (used after login/signup)
- `setLoading(boolean)` - Set loading state
- `clearError()` - Clear error message
- `logout()` - Clear user data and tokens

### Login/Signup Flow

Login and Signup use direct API calls in components:

```typescript
// In Login.tsx
const onSubmit = async (data: LoginFormData) => {
  const response = await loginUser(data);
  storeTokens(response.tokens, data.rememberMe);
  dispatch(setUser(response.user)); // Update Redux state
  navigate('/dashboard');
};
```

### Adding New Slices

To add a new feature slice:

1. Create a new file in `src/redux/slices/`
2. Define the slice using `createSlice`
3. Add async thunks if needed with `createAsyncThunk`
4. Export actions and reducer
5. Add the reducer to the store in `store.ts`

**Example: Creating a Tasks Slice**

```typescript
// src/redux/slices/tasksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasksApi } from '../../api/tasksApi';

type TasksState = {
  items: Task[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunk
export const fetchTasksThunk = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTasksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.push(action.payload);
    },
    removeTask: (state, action) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTasksThunk.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasksThunk.fulfilled, (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchTasksThunk.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
  },
});

export const { addTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
```

**Then add to store:**

```typescript
// src/redux/store.ts
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer, // Add new reducer
  },
});
```

### Best Practices

- **Use typed hooks:** Always use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks
- **Keep slices focused:** Each slice should manage one feature/domain
- **Handle loading & errors:** Every async thunk should handle pending, fulfilled, and rejected states
- **Use `createAsyncThunk`:** For all API calls that need global state management
- **Avoid direct mutations:** Redux Toolkit uses Immer, so you can write "mutating" code safely
- **Keep authentication simple:** Login/Signup can stay as direct API calls; use Redux for data that needs to be shared

### Current Redux Implementation

- ✅ Redux Toolkit installed and configured
- ✅ User slice with fetch current user thunk
- ✅ Typed hooks for TypeScript support
- ✅ Store configured with proper TypeScript types
- ✅ ProtectedRoute uses Redux Thunk for loading user
- ✅ Login/Signup remain as direct API calls (as per requirements)

---

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Thunk Guide](https://redux.js.org/usage/writing-logic-thunks)
- [TypeScript with Redux](https://redux.js.org/usage/usage-with-typescript)
