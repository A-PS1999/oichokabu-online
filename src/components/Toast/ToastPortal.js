import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast.js';

const ToastPortal = () => {
	return createPortal(
		<Toast />,
		document.body
	);
};

export default ToastPortal;