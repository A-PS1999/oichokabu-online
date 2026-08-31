import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.js';
import { getSessID } from './store/userSlice.js';
import './App.scss';
import FrontPage from './components/FrontPage/FrontPage.jsx';
import RulesPage from './components/RulesPage/RulesPage.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Login from './components/Login/Login.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx';
import Lobby from './components/Lobby/Lobby.jsx';
import PregameLobby from './components/PregameLobby/PregameLobby.jsx';
import Game from './components/Game/Game.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import ToastPortal from './components/Toast/ToastPortal.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router';

function AppRoutes() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSessID())
	}, [dispatch])

	return (
		<>
			<ToastPortal />
			<Router>
				<Routes>
					<Route exact path="/" element={<FrontPage />} />
					<Route path="/rules" element={<RulesPage />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/lobby" element={
						<ProtectedRoute>
							<Lobby />
						</ProtectedRoute>
					} />
					<Route path="/pregame-lobby/:gameId" element={
						<ProtectedRoute>
							<PregameLobby />
						</ProtectedRoute>
					} />
					<Route path="/game/:gameId" element={
						<ProtectedRoute>
							<Game />
						</ProtectedRoute>
					} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	)
}

export default function App() {

	return (
		<Provider store={store}>
			<AppRoutes />
		</Provider>
	)
}