import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Toast.scss';
import { removeToast } from '../../store/toastSlice';

export default function Toast() {
	
	const { toasts } = useSelector(state => state.toasts);
	const dispatch = useDispatch();
	const OFFSET_PERCENTAGE = 13;
	const PX_MULTIPLIER = 90;
	
	return toasts.length > 0 ? toasts.map((toast, idx) =>
		<div className="toast" key={toast.id} style={{ bottom: `calc(${OFFSET_PERCENTAGE}% + ${idx * PX_MULTIPLIER}px)` }}>
			<div className="toast__inner">
				<button className="toast__button toast__inner--top" onClick={async () => await dispatch(removeToast(toast.id))}>
					&#10006;
				</button>
				<div>
					{toast.message}
				</div>
			</div>
		</div>
	) : null;
};