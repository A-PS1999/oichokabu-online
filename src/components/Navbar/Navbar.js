import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, logoutUser, getSessID } from '../../store/userSlice.js';
import { userStateReset as clearState } from '../../store/userSlice.js';
import { toastActions } from '../../store/toastSlice.js';
import './Navbar.scss';

export default function Navbar() {
	
	const { isLoggedIn, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoggedIn) {
			dispatch(getSessID())
		}
	}, [dispatch, isLoggedIn])
	
	useEffect(() => {
		if (isSuccessful) {
			dispatch(clearState())
		}
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [dispatch, isSuccessful, isError, errorMessage])
	
	return (
		<nav>
			<div className="navbar">
				<Link to="/" className="navbar__link">
					Oicho Kabu Online
				</Link>
				{
					isLoggedIn 
					?
					<>
						<Link to="/lobby" className="navbar__link lobby-button">
							Lobby
						</Link>
						<Link to="/" onClick={async () => { await dispatch(logoutUser()) }} className="navbar__link">
							Log Out
						</Link>
					</>
					:
					<>
						<Link to="/register" className="navbar__link sign-up">
							Sign Up
						</Link>
						<Link to="/log-in" className="navbar__link">
							Log In
						</Link>
					</>
				}
			</div>
		</nav>
	)
}