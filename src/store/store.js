import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import { lobbySlice } from './lobbySlice';
import { toastSlice } from './toastSlice';
import { modalSlice } from './modalSlice';
import { pregameSlice } from './pregameSlice';

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		toasts: toastSlice.reducer,
		modal: modalSlice.reducer,
		lobby: lobbySlice.reducer,
		pregame: pregameSlice.reducer,
	},
})