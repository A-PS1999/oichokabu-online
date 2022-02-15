import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.scss';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
 
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
							<h2>
								What is Oicho Kabu?
							</h2>
						</div>
						<div>
							<p className="paragraph">
								Oicho Kabu is a traditional Japanese card game which has similarities to 
								Baccarat. Oicho Kabu is usually played with a 40 card deck of <em>kabufuda </em> 
								cards specifically designed for the game, though hanafuda cards can also be used.
							</p>
							<div className="section-about__subheading">
								Want to know how it's played?
							</div>
							<Link to="/rules" className="section-about__link">
								<div>Learn the rules!</div>
							</Link>
						</div>
					</section>
					<section className="section-trivia">
						<h2 className="section-trivia__heading">
							Did you know?
						</h2>
						<div className="card">
							<div className="card__inner">
								<div className="card__side card__side--front">
									<img src="/cards/card1.jpg" alt="card" />
								</div>
								<div className="card__side card__side--back">
									<div className="card__back-container">
										The worst hand in Oicho Kabu is an eight, a nine and a three. This 
										can be expressed as "ya-ku-za". This is where the Japanese word for 
										"gangster" comes from.
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	)
}