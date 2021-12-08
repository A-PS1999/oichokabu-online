import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames, createNewGame } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import Navbar from '../Navbar/Navbar.js';

export default function Lobby() {
	
	const dispatch = useDispatch();
	const { isError, errorMessage } = useSelector(lobbySelector);
	
	useEffect(() => {
		dispatch(fetchGames());
		
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [dispatch])
	
};