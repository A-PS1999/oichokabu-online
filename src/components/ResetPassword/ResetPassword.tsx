import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useWatch } from 'react-hook-form';
import { resetPassword, verifyResetPassword } from '../../store/userSlice';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useAppDispatch } from '../../store/hooks';
import AuthFormLayout from '../shared/AuthFormLayout';
import './ResetPassword.scss';

export type ResetPasswordFormValues = {
	password: string;
	confirmPassword: string;
};

export default function ResetPassword() {
	const { token } = useParams<{ token: string }>();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (token) {
			dispatch(verifyResetPassword({ token }));
		}
	}, [dispatch, token]);

	const { register, handleSubmit, control, submit } = useAuthForm<ResetPasswordFormValues>({
		thunk: (data) => resetPassword({ ...data, token: token ?? '' }),
		successRedirect: '/log-in',
	});

	const newPasswordEntry = useWatch({ control, name: 'password', defaultValue: '' });

	return (
		<AuthFormLayout heading="Enter Your New Password" className="reset-password">
			<form onSubmit={handleSubmit(submit)}>
				<input
					{...register('password', { required: true, minLength: 8 })}
					placeholder="Password"
					type="password"
				/>
				<input
					{...register('confirmPassword', {
						required: true,
						validate: (v) => v === newPasswordEntry,
					})}
					placeholder="Confirm Password"
					type="password"
				/>
				<button className="reset-password-form__button" type="submit">
					Submit
				</button>
			</form>
		</AuthFormLayout>
	);
}
