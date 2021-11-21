import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.scss';
import Navbar from '../Navbar/Navbar.js';
 
export default function FrontPage() {
	
	return (
		<>
			<Navbar />
			<div>
				<header>
					<div className="header-text-box">
						<h1 className="heading-primary">
							Oicho Kabu Online
						</h1>
						<Link to="/register" className="header-link">
							Sign up now!
						</Link>
					</div>
				</header>
				<main>
					<section className="section-about">
						<div>
							<h2>What is Oicho Kabu?</h2>
						</div>
						<div>
							<p>
								Oicho Kabu is a traditional Japanese card game which has similarities to 
								Baccarat. Oicho Kabu is usually played with a 40 card deck of <em>kabufuda </em> 
								cards specifically designed for the game, though hanafuda cards can also be used.
							</p>
							<div>Want to know how it's played?</div>
							<Link to="/rules">
								<div>Learn the rules!</div>
							</Link>
						</div>
					</section>
				</main>
			</div>
		</>
	)
}