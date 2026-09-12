import { submitForgotPassword } from '../../store/userSlice';
import { useAuthForm } from '../../hooks/useAuthForm';
import AuthFormLayout from '../shared/AuthFormLayout';
import './ForgotPassword.scss';

export type ForgotPasswordFormValues = {
	email: string;
};

export default function ForgotPassword() {
	const { register, handleSubmit, submit } = useAuthForm<ForgotPasswordFormValues>({
		thunk: submitForgotPassword,
		successToast: 'Request submitted! You should receive an email soon.',
	});

	return (
		<AuthFormLayout
			heading="Reset Your Password"
			subheading="Enter the email address associated with your account. A reset link will be sent to you."
			className="forgot-password"
		>
			<form onSubmit={handleSubmit(submit)}>
				<input
					{...register('email', { required: true, pattern: /\S+@\S+\.\S+/ })}
					type="email"
					placeholder="E-Mail"
				/>
				<button className="forgot-password-form__button" type="submit">
					Submit
				</button>
			</form>
		</AuthFormLayout>
	);
}
