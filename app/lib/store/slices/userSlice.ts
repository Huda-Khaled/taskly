import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface UserState {
  data: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const fetchUser = createAsyncThunk<User, string>(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return (await response.json()) as User;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  Partial<User> & { id: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/users/${userData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return (await response.json()) as User;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },

    clearUser(state) {
      state.data = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },

    clearUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
