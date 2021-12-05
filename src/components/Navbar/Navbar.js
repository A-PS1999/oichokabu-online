import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, logoutUser } from '../../store/userSlice.js';
import { userStateReset as clearState } from '../../store/userSlice.js';
import { toastActions } from '../../store/toastSlice.js';
import './Navbar.scss';

export default function Navbar() {
	
	let history = useHistory();
	const { isLoggedIn, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (isSuccessful) {
			dispatch(clearState());
		}
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [history, dispatch, isSuccessful, isError, errorMessage])
	
	return (
		<nav>
			<ul className="navbar">
				<Link to="/" className="navbar__link">
					<li>Oicho Kabu Online</li>
				</Link>
				{
					isLoggedIn 
					?
					<>
						<Link to="/" onClick={async () => {await dispatch(logoutUser())}} className="navbar__link">
							<li>Log Out</li>
						</Link>
					</>
					:
					<>
						<Link to="/register" className="navbar__link sign-up">
							<li>Sign Up</li>
						</Link>
						<Link to="/log-in" className="navbar__link">
							<li>Log In</li>
						</Link>
					</>
				}
			</ul>
		</nav>
	)
}