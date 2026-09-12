import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Toast = {
	id: string;
	message: string;
	type: string;
	duration: number;
};

export type ToastState = {
	toasts: Toast[];
};

export type CreateToastPayload = {
	message: string;
	type: string;
	duration?: number;
};

export const toastSlice = createSlice({
	name: 'toasts',
	initialState: { toasts: [] } as ToastState,
	reducers: {
		createToast: (state, action: PayloadAction<CreateToastPayload>) => {
			state.toasts.push({
				id: `${Date.now()}-${action.payload.message}`,
				message: action.payload.message,
				type: action.payload.type,
				duration: action.payload.duration || 4000,
			});
		},
		removeToast: (state, action: PayloadAction<string>) => {
			state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
		},
	},
});

export const { createToast, removeToast } = toastSlice.actions;

