import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
	name: "modal",
	initialState: {
		isOpen: false,
	},
	reducers: {
		toggleModal(state) {
			return {
				...state,
				isOpen: !state.isOpen
			}
		}
	}
});

export const modalActions = modalSlice.actions;
export const modalSelector = state => state.modal;