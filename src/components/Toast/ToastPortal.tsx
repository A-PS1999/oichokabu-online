import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastPortal = () => {
	return createPortal(<Toast />, document.body);
};

export default ToastPortal;
