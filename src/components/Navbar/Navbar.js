import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

export default function Navbar() {
	
	return (
		<nav>
			<ul className="navbar">
				<Link to="/" className="navbar__link">
					<li>Oicho Kabu Online</li>
				</Link>
				<Link to="/register" className="navbar__link sign-up">
					<li>Sign Up</li>
				</Link>
				<Link to="/log-in" className="navbar__link">
					<li>Log In</li>
				</Link>
			</ul>
		</nav>
	)
}