import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastState } from '../types';

const initialState: ToastState = {
  message: '',
  type: 'info',
  visible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = '';
    },
    clearToast: (state) => {
      state.visible = false;
      state.message = '';
    },
  },
});

export const { showToast, hideToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
