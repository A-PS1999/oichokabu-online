import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginUser, userSelector } from '../../store/userSlice.js';
import Navbar from '../Navbar/Navbar.js';

export default function Login() {
	
	let history = useHistory();
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const { isFetching, isSuccessful, isError, errorMessage } = useSelector(userSelector);
	
	const submitData = (data) => {
		dispatch(loginUser(data))
	};
	
	useEffect(() => {
		if (isSuccessful) {
			history.push("/");
		}
		if (isError) {
			
		}
	}, [isSuccessful, isError])
	
	return (
		<>
			<Navbar />
			<div>
				<main>
					<div>
						<form onSubmit={handleSubmit(submitData)}>
							<div>
								<input {...register("username", { required: true })} placeholder="Username" />
								<input {...register("password", { required: true })} placeholder="Password" />
								<button type="submit">Submit</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</>
	)
}