import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
	
	return (
		<Provider store={store}>
		<ToastPortal />
			<Router>
				<Routes>
					<Route exact path="/" element={<FrontPage />} />
					<Route path="/rules" element={<RulesPage />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/lobby" element={<Lobby />} />
					<Route path="/pregame-lobby/:gameId" element={<PregameLobby />} />
					<Route path="/game/:gameId" element={<Game />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</Provider>
	)
}