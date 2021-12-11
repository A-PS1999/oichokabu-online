import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import './App.scss';
import FrontPage from './components/FrontPage/FrontPage.js';
import SignUp from './components/SignUp/SignUp.js';
import Login from './components/Login/Login.js';
import Lobby from './components/Lobby/Lobby.js';
import ToastPortal from './components/Toast/ToastPortal.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default function App() {
	
	return (
		<Provider store={store}>
		<ToastPortal />
			<Router>
				<Switch>
					<Route exact path="/" component={FrontPage} />
					<Route path="/register" component={SignUp} />
					<Route path="/log-in" component={Login} />
					<Route path="/lobby" component={Lobby} />
				</Switch>
			</Router>
		</Provider>
	)
}