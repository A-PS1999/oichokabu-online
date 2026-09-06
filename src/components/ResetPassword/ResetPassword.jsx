import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useWatch } from 'react-hook-form';
import { resetPassword, verifyResetPassword } from '../../store/userSlice.js';
import { useAuthForm } from '../../hooks/useAuthForm.js';
import AuthFormLayout from '../shared/AuthFormLayout.jsx';
import './ResetPassword.scss';

export default function ResetPassword() {
    const { token } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(verifyResetPassword({ token }));
    }, [dispatch, token]);

    const { register, handleSubmit, control, submit } = useAuthForm({
        thunk: (data) => resetPassword({ ...data, token }),
        successRedirect: "/log-in",
    });

    const newPasswordEntry = useWatch({ control, name: "password", defaultValue: "" });

    return (
        <AuthFormLayout heading="Enter Your New Password" className="reset-password">
            <form onSubmit={handleSubmit(submit)}>
                <input
                    {...register("password", { required: true, minLength: 8 })}
                    placeholder="Password"
                    type="password"
                />
                <input
                    {...register("confirmPassword", {
                        required: true,
                        validate: v => v === newPasswordEntry,
                    })}
                    placeholder="Confirm Password"
                    type="password"
                />
                <button className="reset-password-form__button" type="submit">Submit</button>
            </form>
        </AuthFormLayout>
    );
}