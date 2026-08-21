import React from 'react';
import Navbar from '../../Navbar/Navbar.jsx';
import Footer from '../../Footer/Footer.jsx';
import './AuthFormLayout.scss';

export default function AuthFormLayout({
    heading,
    subheading,
    children,
    footer,
    className = ""
}) {
    return (
        <>
            <Navbar />
            <div>
                <main>
                    <h2 className={`auth-heading ${className}`}>
                        {heading}
                    </h2>
                    {subheading &&
                        <p className="auth-sub">
                            {subheading}
                        </p>
                    }
                    <div className="form-container">
                        <div className={`auth-form ${className}`}>
                            {children}
                        </div>
                    </div>
                    {footer}
                </main>
            </div>
            <Footer />
        </>
    )
}