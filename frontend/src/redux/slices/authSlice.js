import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/api';
import { ENDPOINTS } from '../../config/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', ENDPOINTS.AUTH.USER);
      return response.user;
    } catch (error) {
      localStorage.removeItem('token'); // Remove invalid token
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  }
});

export const { loginSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 