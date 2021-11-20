import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
	
	return (
		<nav>
			<Link to="/">
				<div>Oicho Kabu Online</div>
			</Link>
			<Link to="/register">
				<div>Sign Up</div>
			</Link>
			<Link to="/log-in">
				<div>Log In</div>
			</Link>
		</nav>
	)
}