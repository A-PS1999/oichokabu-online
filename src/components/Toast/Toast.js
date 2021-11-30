import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Toast.scss';

export default function Toast() {
	
	const { toasts } = useSelector(state => state.toasts);
	const [toast, setToast] = useState({ message: "", type: "" });
	const [showToast, setShowToast] = useState(false);
	
	useEffect(() => {
		if (toasts.length > 0) {
			setToast(toasts[toasts.length - 1]);
			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 5500);
		}
	}, [toasts]);
	
	const closeToast = () => {
		setShowToast(false);
	};
	
	return showToast ? (
		<div className="toast">
			<div className="toast__inner">
				<button className="toast__button toast__inner--top" onClick={closeToast}>&#10006;</button>
				<div>
					{toast.message}
				</div>
			</div>
		</div>
	) : null;
};