import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import { lobbySlice } from './lobbySlice';
import { toastSlice } from './toastSlice';

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		toasts: toastSlice.reducer,
		lobby: lobbySlice.reducer,
	},
})