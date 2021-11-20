import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.js';
 
export default function FrontPage() {
	
	return (
		<>
			<Navbar />
			<div>
				<header>
					<div className="header__text-box">
						<h1 className="heading-primary">
							Oicho-Kabu Online
						</h1>
						<Link to="/register">
							<div>Sign up now!</div>
						</Link>
					</div>
				</header>
			</div>
		</>
	)
}