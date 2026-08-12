import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast.jsx';

const ToastPortal = () => {
	return createPortal(
		<Toast />,
		document.body
	);
};

export default ToastPortal;