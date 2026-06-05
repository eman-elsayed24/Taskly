# Redux Global State Management

This project uses **Redux Toolkit** with **Redux Thunk** for global state management.

## Structure

```
src/redux/
├── store.ts          # Store configuration
├── hooks.ts          # Typed hooks (useAppDispatch, useAppSelector)
├── slices/           # Feature slices
│   └── userSlice.ts  # User data management
└── README.md         # This file
```

## Important Note

**Authentication (Login/Signup)** is handled with **direct API calls** in components.  
**User Data Management** is handled with **Redux Thunk** for global state.

This separation keeps authentication flows simple while managing user state globally across the app.

## Usage

### 1. Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUserThunk, logout } from '../redux/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading, error } = useAppSelector((state) => state.user);

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

### 2. Available User Actions

#### Async Thunk (API Call)

- `fetchCurrentUserThunk()` - Fetch current authenticated user data

#### Synchronous Actions

- `setUser(user)` - Manually set user data (used after login/signup)
- `setLoading(boolean)` - Set loading state
- `clearError()` - Clear error message
- `logout()` - Clear user data and tokens

### 3. Login/Signup Flow (Using Regular Fetch)

Login and Signup remain in components with direct API calls:

```typescript
// In Login.tsx
const onSubmit = async (data: LoginFormData) => {
  const response = await loginUser(data);
  storeTokens(response.tokens, data.rememberMe);
  dispatch(setUser(response.user)); // Update Redux state
  navigate('/dashboard');
};
```

## Adding New Slices

To add a new feature slice:

1. Create a new file in `src/redux/slices/`
2. Define the slice using `createSlice`
3. Add async thunks if needed with `createAsyncThunk`
4. Export actions and reducer
5. Add the reducer to the store in `store.ts`

### Example: Creating a Tasks Slice

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

Then add to store:

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

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks
2. **Keep slices focused**: Each slice should manage one feature/domain
3. **Handle loading & errors**: Every async thunk should handle pending, fulfilled, and rejected states
4. **Use createAsyncThunk**: For all API calls that need global state management
5. **Avoid direct mutations**: Redux Toolkit uses Immer, so you can write "mutating" code safely
6. **Keep authentication simple**: Login/Signup can stay as direct API calls; use Redux for data that needs to be shared

## Current Implementation

- ✅ Redux Toolkit installed and configured
- ✅ User slice with fetch current user thunk
- ✅ Typed hooks for TypeScript support
- ✅ Store configured with proper TypeScript types
- ✅ ProtectedRoute uses Redux Thunk for loading user
- ✅ Login/Signup remain as direct API calls (as per requirements)

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Thunk Guide](https://redux.js.org/usage/writing-logic-thunks)
- [TypeScript with Redux](https://redux.js.org/usage/usage-with-typescript)
