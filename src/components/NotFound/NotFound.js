import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.scss';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className='outer-container'>
                <main className="notfound">
                    <img src="/404-img.png" className="notfound__img" alt="404: Page not found" />
                    <h1 className="notfound__text">Uh oh! It looks like the page you're looking for doesn't exist.</h1>
                    <div className='notfound__button-container'>
                        <Link to="/" className="notfound__button-container__link">
                            Return to home page
                        </Link>
                        <button className="notfound__button-container__button" onClick={() => navigate(-1)}>
                            Previous page
                        </button>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}