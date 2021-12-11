import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { modalActions, modalSelector } from '../../store/modalSlice.js';

export default function Modal({ children }) {
	
	const dispatch = useDispatch();
	const { isOpen } = useSelector(modalSelector);
	
	return createPortal(
		<div className={isOpen ? 'modal__outer-container--visible' : 'modal__outer-container--hidden'}>
			{isOpen && (
				<div>
					<button onClick={dispatch(modalActions.toggleModal)}>&#10006;</button>
					{children}
				</div>
			)}
		</div>,
		document.body,
	);
};