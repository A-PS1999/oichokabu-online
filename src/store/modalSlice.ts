import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './types';

export type ModalState = {
	isOpen: boolean;
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState: { isOpen: false } as ModalState,
	reducers: {
		toggleModal(state) {
			state.isOpen = !state.isOpen;
		},
	},
});

export const modalActions = modalSlice.actions;
export const modalSelector = (state: RootState): ModalState => state.modal;

