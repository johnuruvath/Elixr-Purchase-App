import { createSlice } from '@reduxjs/toolkit';

interface ToastState {
  message: string | null;
  show: boolean;
}

const initialState: ToastState = {
  message: null,
  show: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showMessage(state, action) {
      state.message = action.payload;
      state.show = true;
    },
    hideMessage(state) {
      state.message = null;
      state.show = false;
    },
  },
});

export const { showMessage, hideMessage } = toastSlice.actions;
export default toastSlice.reducer;
