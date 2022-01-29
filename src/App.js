import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import './App.scss';
import FrontPage from './components/FrontPage/FrontPage.js';
import SignUp from './components/SignUp/SignUp.js';
import Login from './components/Login/Login.js';
import Lobby from './components/Lobby/Lobby.js';
import PregameLobby from './components/PregameLobby/PregameLobby.js';
import ToastPortal from './components/Toast/ToastPortal.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
	
	return (
		<Provider store={store}>
		<ToastPortal />
			<Router>
				<Routes>
					<Route exact path="/" element={<FrontPage />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/lobby" element={<Lobby />} />
					<Route path="/pregame-lobby/:gameId" element={<PregameLobby />} />
				</Routes>
			</Router>
		</Provider>
	)
}