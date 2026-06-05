import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth';
import { clearTokens } from '../../lib/cookies';
import { getCurrentUser } from '../../api/userApi';

type UserState = {
  data: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  data: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunk - Fetch Current User
export const fetchCurrentUserThunk = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    logout: state => {
      state.data = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      clearTokens();
    },
  },
  extraReducers: builder => {
    // Fetch Current User
    builder.addCase(fetchCurrentUserThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchCurrentUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
  },
});

export const { setUser, setLoading, clearError, logout } = userSlice.actions;
export default userSlice.reducer;
