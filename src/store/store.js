import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import { toastSlice } from './toastSlice';

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		toasts: toastSlice.reducer,
	},
})