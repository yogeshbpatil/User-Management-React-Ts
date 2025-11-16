import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, FormData, UserState, CreateUserRequest } from '../types';
import { userService, convertToDisplayFormat } from '../../services/userService';

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await userService.getUsers();
      return users;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const newUser = await userService.createUser(userData);
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      return { id, updatedUser };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

// Initial state
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  editingUser: null,
};

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setEditingUser: (state, action: PayloadAction<FormData | null>) => {
      state.editingUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEditingUser: (state) => {
      state.editingUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload.map(user => ({
          ...user,
          dateOfBirth: convertToDisplayFormat(user.dateOfBirth),
        }));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const formattedUser: User = {
          ...action.payload,
          dateOfBirth: convertToDisplayFormat(action.payload.dateOfBirth),
        };
        state.users.push(formattedUser);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updatedUser } = action.payload;
        const index = state.users.findIndex(user => user._id === id);
        if (index !== -1) {
          state.users[index] = {
            ...updatedUser,
            _id: id,
            dateOfBirth: convertToDisplayFormat(updatedUser.dateOfBirth),
          };
        }
        state.editingUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { setEditingUser, clearError, clearEditingUser } = userSlice.actions;
export default userSlice.reducer;
