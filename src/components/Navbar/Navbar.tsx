import { useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { userSelector, logoutUser, userStateReset as clearState } from '../../store/userSlice';
import { createToast } from '../../store/toastSlice';
import { useAppDispatch } from '../../store/hooks';
import './Navbar.scss';

export default function Navbar() {
	const { sessionStatus, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (isSuccessful) {
			dispatch(clearState());
		}
		if (isError) {
			dispatch(
				createToast({
					message: errorMessage,
					type: 'error',
				}),
			);
			dispatch(clearState());
		}
	}, [dispatch, isSuccessful, isError, errorMessage]);

	const handleLogout = useCallback(async () => {
		await dispatch(logoutUser());
	}, [dispatch]);

	const renderNavbarLinkBtns = () => {
		switch (sessionStatus) {
			case 'authenticated':
				return (
					<>
						<Link to="/lobby" className="navbar__link lobby-button">
							Lobby
						</Link>
						<Link to="/" onClick={handleLogout} className="navbar__link">
							Log Out
						</Link>
					</>
				);
			case 'checking':
				return null;
			default:
				return (
					<>
						<Link to="/register" className="navbar__link sign-up">
							Sign Up
						</Link>
						<Link to="/log-in" className="navbar__link">
							Log In
						</Link>
					</>
				);
		}
	};

	return (
		<nav>
			<div className="navbar">
				<Link to="/" className="navbar__link">
					Oicho Kabu Online
				</Link>
				{renderNavbarLinkBtns()}
			</div>
		</nav>
	);
}
