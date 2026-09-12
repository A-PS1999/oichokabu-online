import { Link } from 'react-router';
import { loginUser } from '../../store/userSlice';
import { useAuthForm } from '../../hooks/useAuthForm';
import AuthFormLayout from '../shared/AuthFormLayout';
import './Login.scss';

export type LoginFormValues = {
	username: string;
	password: string;
};

export default function Login() {
	const { register, handleSubmit, submit } = useAuthForm<LoginFormValues>({
		thunk: loginUser,
		successRedirect: '/lobby',
	});

	return (
		<AuthFormLayout
			heading="Log In"
			className="login"
			footer={
				<div className="forgot-password-link">
					Forgotten your password? <Link to="/forgot-password">Click here</Link>
				</div>
			}
		>
			<form onSubmit={handleSubmit(submit)}>
				<input {...register('username', { required: true })} placeholder="Username" />
				<input {...register('password', { required: true })} placeholder="Password" type="password" />
				<button className="login-form__button" type="submit">
					Submit
				</button>
			</form>
		</AuthFormLayout>
	);
}
