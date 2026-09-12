import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { getSessID } from './store/userSlice';
import { useAppDispatch } from './store/hooks';
import './App.scss';
import FrontPage from './components/FrontPage/FrontPage';
import RulesPage from './components/RulesPage/RulesPage';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Lobby from './components/Lobby/Lobby';
import PregameLobby from './components/PregameLobby/PregameLobby';
import Game from './components/Game/Game';
import NotFound from './components/NotFound/NotFound';
import ToastPortal from './components/Toast/ToastPortal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router';

function AppRoutes() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getSessID());
	}, [dispatch]);

	return (
		<>
			<ToastPortal />
			<Router>
				<Routes>
					<Route path="/" element={<FrontPage />} />
					<Route path="/rules" element={<RulesPage />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route
						path="/lobby"
						element={
							<ProtectedRoute>
								<Lobby />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/pregame-lobby/:gameId"
						element={
							<ProtectedRoute>
								<PregameLobby />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/game/:gameId"
						element={
							<ProtectedRoute>
								<Game />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<AppRoutes />
		</Provider>
	);
}
