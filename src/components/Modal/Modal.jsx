import React, { useEffect, useRef } from 'react';
import './Modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { modalActions, modalSelector } from '../../store/modalSlice.js';

export default function Modal({ children }) {
	
	const dispatch = useDispatch();
	const { isOpen } = useSelector(modalSelector);
	const modalRef = useRef(null);

	useEffect(() => {
		const handleClick = (e) => {
			if (modalRef.current && e.target === modalRef.current) {
				dispatch(modalActions.toggleModal())
			}
		};
		if (isOpen) {
			window.addEventListener("click", handleClick)
		}
		return () => {
			window.removeEventListener("click", handleClick);
		}
	}, [dispatch, isOpen])
	
	return createPortal(
		<div ref={modalRef} className={isOpen ? 'modal--visible' : 'modal--hidden'}>
			{isOpen && (
				<div className='modal__inner-container'>
					<button className='modal__button' onClick={async () => { await dispatch(modalActions.toggleModal()) }}>&#10006;</button>
					{children}
				</div>
			)}
		</div>,
		document.body,
	);
};