import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
	name: "toasts",
	initialState: {
		toasts: []
	},
	reducers: {
		createToast: (state, action) => {
			state.toasts.push({
				message: action.payload.message,
				type: action.payload.type
			});
		}
	},
	extraReducers: {
		
	},
});

export const toastActions = toastSlice.actions;
export default toastSlice;