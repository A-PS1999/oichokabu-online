import React from 'react';
import './Footer.scss';

export default function Footer() {
	
	return (
		<footer>
			<div>
				<ul>
					<li className="footer-text">Developed by Samuel Arnold-Parra</li>
						<div className="footer-subcontainer">
							<li className='footer-subcontainer__li'>
								<a className="footer-subcontainer__link-container" href="https://www.linkedin.com/in/samuel-arnold-parra-2899721b6/">
									<img src="/linkedin.svg" alt="LinkedIn" />
								</a>
							</li>
							<li className='footer-subcontainer__li'>
								<a className="footer-subcontainer__link-container" href="https://github.com/A-PS1999/oichokabu-online">
									<img src="/github.svg" alt="GitHub" />
								</a>
							</li>
						</div>
				</ul>
			</div>
		</footer>
	)
}