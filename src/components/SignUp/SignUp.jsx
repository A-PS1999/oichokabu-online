import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWatch } from 'react-hook-form';
import { registerUser } from '../../store/userSlice.js';
import { createToast } from '../../store/toastSlice.js';
import { useAuthForm } from '../../hooks/useAuthForm.js';
import AuthFormLayout from '../shared/AuthFormLayout.jsx';
import './SignUp.scss';

const VALIDATION_TOASTS = {
	confirmPassword: "Password entries do not match",
	password: "Passwords must be at least 8 characters long",
	username: "Usernames must be between 3 and 15 characters long",
	email: "E-mail address not formatted correctly",
};

export default function SignUp() {
	const dispatch = useDispatch();
	const { register, handleSubmit, formState: { errors, isSubmitted }, reset, control, submit }
		= useAuthForm({
			thunk: registerUser,
			successRedirect: "/lobby",
		});

	const passwordEntry = useWatch({ control, name: "password", defaultValue: "" });

	useEffect(() => {
		if (!isSubmitted) return;
		for (const [field, toast] of Object.entries(VALIDATION_TOASTS)) {
			if (errors[field]) {
				dispatch(createToast({ message: toast, type: "error" }));
			}
		}
		if (Object.keys(errors).length > 0) reset();
	}, [errors, isSubmitted, dispatch, reset]);

	return (
		<AuthFormLayout heading="Sign Up" className="signup">
			<form onSubmit={handleSubmit(submit)}>
				<input
					{...register("username", { required: true, minLength: 3, maxLength: 15 })}
					placeholder="Username"
				/>
				<input
					{...register("email", { required: true, pattern: /\S+@\S+\.\S+/ })}
					type="email"
					placeholder="E-Mail"
				/>
				<input {...register("password", { required: true, minLength: 8 })}
					placeholder="Password"
					type="password"
				/>
				<input
					{...register("confirmPassword", { required: true, validate: v => v === passwordEntry })}
					placeholder="Confirm Password"
					type="password"
				/>
				<button className="signup-form__button" type="submit">Submit</button>
			</form>
		</AuthFormLayout>
	);
}