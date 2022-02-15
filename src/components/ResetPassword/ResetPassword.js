import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, resetPassword, verifyResetPassword } from '../../store/userSlice';
import { userStateReset as clearState } from '../../store/userSlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { useForm } from 'react-hook-form';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';
import './ResetPassword.scss';

export default function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const { isSuccessful, isError, errorMessage } = useSelector(userSelector);

    const submitData = (data) => {
        data.token = token;
        dispatch(resetPassword(data));
    }

    useEffect(() => {
        dispatch(verifyResetPassword({ token }))
    }, [dispatch, token])

    useEffect(() => {
        if (isSuccessful) {
            dispatch(clearState());
            navigate("/log-in");
        }
        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error"
            }))
            dispatch(clearState())
            navigate("/")
        }
    }, [dispatch, isError, errorMessage, isSuccessful, navigate])

    return (
        <>
            <Navbar />
                <div>
                    <main>
                        <h2 className="reset-password-heading">Enter Your New Password</h2>
                        <div className="form-container">
                            <div className="reset-password-form">
                                <form onSubmit={handleSubmit(submitData)}>
                                    <input {...register("password", { required: true })} placeholder="Password" type="password" />
                                    <input {...register("confirmPassword", { required: true })} placeholder="Confirm Password" type="password" />
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