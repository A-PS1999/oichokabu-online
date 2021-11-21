import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, userSelector } from '../../store/userSlice.js';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../Navbar/Navbar.js';

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
					<div>
						<form onSubmit={handleSubmit(submitData)}>
							<div>
								<input {...register("username", { required: true })} placeholder="Username" />
								<input {...register("email", { required: true })} placeholder="E-Mail" />
								<input {...register("password", { required: true })} placeholder="Password" />
								<input {...register("confirmPassword", { required: true })} placeholder="Confirm Password" />
								<button type="submit">Submit</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</>
	)
}