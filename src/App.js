import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import './App.scss';
import FrontPage from './components/FrontPage/FrontPage.js';
import RulesPage from './components/RulesPage/RulesPage.js';
import SignUp from './components/SignUp/SignUp.js';
import Login from './components/Login/Login.js';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.js';
import ResetPassword from './components/ResetPassword/ResetPassword.js';
import Lobby from './components/Lobby/Lobby.js';
import PregameLobby from './components/PregameLobby/PregameLobby.js';
import Game from './components/Game/Game.js';
import NotFound from './components/NotFound/NotFound.js';
import ToastPortal from './components/Toast/ToastPortal.js';
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