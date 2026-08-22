import React, { useCallback, useEffect, useRef } from 'react';
import './Modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { modalActions, modalSelector } from '../../store/modalSlice.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

const APP_ROOT_ID = "app";

export default function Modal({ children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy }) {

	const dispatch = useDispatch();
	const { isOpen } = useSelector(modalSelector);
	const modalRef = useRef(null);

	const toggle = useCallback(() => {
		dispatch(modalActions.toggleModal());
	}, [dispatch]);

	useFocusTrap({ active: isOpen, onClose: toggle, containerRef: modalRef });

	useEffect(() => {
		if (!isOpen) return;
		const appRoot = document.getElementById(APP_ROOT_ID);
		if (appRoot) appRoot.setAttribute('aria-hidden', 'true');
		return () => {
			if (appRoot) {
				appRoot.removeAttribute('aria-hidden');
			}
		}
	}, [isOpen]);

	const handleBackdropMouseDown = (e) => {
		if (e.target === e.currentTarget) toggle();
	}

	if (!isOpen) return null;

	return createPortal(
		<div className='modal--backdrop' onMouseDown={handleBackdropMouseDown}>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				className='modal__inner-container'
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
			>
				<button
					type='button'
					className='modal__button'
					aria-label='Close modal'
					onClick={toggle}
				>
					&#10006;
				</button>
				{children}
			</div>
		</div>,
		document.body,
	);
};