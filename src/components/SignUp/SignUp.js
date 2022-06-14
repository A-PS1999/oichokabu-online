import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, userSelector } from '../../store/userSlice.js';
import { userStateReset as clearState } from '../../store/userSlice.js';
import { toggleLoggedIn as setLoggedIn } from '../../store/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { toastActions } from '../../store/toastSlice.js';
import { useForm } from 'react-hook-form';
import './SignUp.scss'
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';

export default function SignUp() {
	
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const passwordEntry = useRef({});
	const { register, handleSubmit, watch, formState: { errors, isSubmitted }, reset } = useForm();
	const { isSuccessful, isError, errorMessage } = useSelector(userSelector);
	passwordEntry.current = watch("password", "");
	
	const submitData = (data) => {
		dispatch(registerUser(data))
	};
	
	useEffect(() => {
		if (isSuccessful) {
			dispatch(clearState());
			dispatch(setLoggedIn());
			navigate("/lobby");
		}
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [isSuccessful, isError, dispatch, navigate, errorMessage]);

	useEffect(() => {
		if (isSubmitted && errors) {
			if (errors.confirmPassword && errors.confirmPassword.type === 'validate') {
				dispatch(toastActions.createToast({
					message: "Password entries do not match",
					type: "error",
				}));
				dispatch(clearState());
			}
			if (errors.password && errors.password.type === "minLength") {
				dispatch(toastActions.createToast({
					message: "Passwords must be at least 8 characters long",
					type: "error",
				}));
				dispatch(clearState());
			}
			if (errors.username) {
				dispatch(toastActions.createToast({
					message: "Usernames must be between 3 and 15 characters long",
					type: "error",
				}));
				dispatch(clearState());
			}
			if (errors.email && errors.email.type === "pattern") {
				dispatch(toastActions.createToast({
					message: "E-mail address not formatted correctly",
					type: "error",
				}));
				dispatch(clearState());
			}
			reset();
		}
	}, [errors, isSubmitted, dispatch, reset])
	
	return (
		<>
			<Navbar />
			<div>
				<main>
					<h2 className="signup-heading">Sign Up</h2>
					<div className="form-container">
						<div className="signup-form">
							<form onSubmit={handleSubmit(submitData)}>
									<input 
										{...register("username", { 
											required: true, 
											minLength: 3,
											maxLength: 15
										})} 
										placeholder="Username" 
									/>
									<input 
										{...register("email", { 
											required: true, 
											pattern: /\S+@\S+\.\S+/
										})} 
										placeholder="E-Mail" 
									/>
									<input {...register("password", { 
											required: true,
											minLength: 8
										})} 
										placeholder="Password" 
										type="password" 
									/>
									<input {...register("confirmPassword", { 
											required: true,
											validate: value => value === passwordEntry.current
										})} 
										placeholder="Confirm Password" 
										type="password" 
									/>
									<button className="signup-form__button" type="submit">Submit</button>
							</form>
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	)
};