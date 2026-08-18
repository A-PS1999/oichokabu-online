import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
	name: "toasts",
	initialState: {
		toasts: []
	},
	reducers: {
		createToast: (state, action) => {
			state.toasts.push({
				id: Date.now(),
				message: action.payload.message,
				type: action.payload.type,
				duration: action.payload.duration || 4000
			});
		},
		removeToast: (state, action) => {
			state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
		}
	}
});

export const { createToast, removeToast } = toastSlice.actions;