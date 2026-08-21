import React from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../store/userSlice.js';
import { useAuthForm } from '../../hooks/useAuthForm.js';
import AuthFormLayout from '../shared/AuthFormLayout.jsx';
import './Login.scss';

export default function Login() {
	const { register, handleSubmit, submit } = useAuthForm({
		thunk: loginUser,
		successRedirect: "/lobby",
		setLoggedInOnSuccess: true,
	});

	return (
		<AuthFormLayout heading="Log In" className="login"
			footer={
				<div className="forgot-password-link">
					Forgotten your password? <Link to="/forgot-password">Click here</Link>
				</div>
			}
		>
			<form onSubmit={handleSubmit(submit)}>
				<input {...register("username", { required: true })} placeholder="Username" />
				<input {...register("password", { required: true })} placeholder="Password" type="password" />
				<button className="login-form__button" type="submit">Submit</button>
			</form>
		</AuthFormLayout>
	);
}