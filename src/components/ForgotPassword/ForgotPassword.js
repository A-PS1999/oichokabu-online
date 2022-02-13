import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, submitForgotPassword } from '../../store/userSlice';
import { toastActions } from '../../store/toastSlice.js';
import { useForm } from 'react-hook-form';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
import './ForgotPassword.scss';

export default function ForgotPassword() {

    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const { isSuccessful, isError, errorMessage } = useSelector(userSelector);

    const submitData = (data) => {
        dispatch(submitForgotPassword(data));
    }

    useEffect(() => {
        if (isSuccessful) {
            dispatch(toastActions.createToast({
                message: "Request submitted! You should receive an email soon.",
                type: "success"
            }))
        }
        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error"
            }))
        }
    }, [dispatch, isSuccessful, isError, errorMessage])

    return (
        <>
            <Navbar />
                <div>
                    <main>
                        <h2 className="reset-password-heading">Reset Your Password</h2>
                        <p className="reset-password-sub">Enter the email address associated with your account. A reset link will be sent to you.</p>
                        <div className="form-container">
                            <div className="reset-password-form">
                                <form onSubmit={handleSubmit(submitData)}>
                                    <input {...register("email", { required: true })} placeholder="E-Mail" />
                                    <button className="reset-password-form__button" type="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            <Footer />
        </>
    )
}