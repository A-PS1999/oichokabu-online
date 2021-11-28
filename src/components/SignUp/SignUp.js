import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, userSelector } from '../../store/userSlice.js';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './SignUp.scss'
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';

export default function SignUp() {
	
	let history = useHistory();
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const { isFetching, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	
	const submitData = (data) => {
		dispatch(registerUser(data))
	};
	
	useEffect(() => {
		if (isSuccessful) {
			history.push("/");
		}
		if (isError) {
			
		}
	}, [isSuccessful, isError]);
	
	return (
		<>
			<Navbar />
			<div>
				<main>
					<h2 className="signup-heading">Sign Up</h2>
					<div className="form-container">
						<div className="signup-form">
							<form onSubmit={handleSubmit(submitData)}>
									<input {...register("username", { required: true })} placeholder="Username" />
									<input {...register("email", { required: true })} placeholder="E-Mail" />
									<input {...register("password", { required: true })} placeholder="Password" />
									<input {...register("confirmPassword", { required: true })} placeholder="Confirm Password" />
									<button type="submit">Submit</button>
							</form>
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	)
}