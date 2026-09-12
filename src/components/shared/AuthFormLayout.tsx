import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './AuthFormLayout.scss';
import type { ReactNode } from 'react';

export type AuthFormLayoutProps = {
	heading: ReactNode;
	subheading?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
};

export default function AuthFormLayout({
	heading,
	subheading,
	children,
	footer,
	className = '',
}: AuthFormLayoutProps) {
	return (
		<>
			<Navbar />
			<div>
				<main>
					<h2 className={`auth-heading ${className}-heading`}>{heading}</h2>
					{subheading && <p className="auth-sub">{subheading}</p>}
					<div className="form-container">
						<div className={`auth-form ${className}-form`}>{children}</div>
					</div>
					{footer}
				</main>
			</div>
			<Footer />
		</>
	);
}
