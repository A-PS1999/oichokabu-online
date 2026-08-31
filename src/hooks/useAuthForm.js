import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userSelector, userStateReset } from "../store/userSlice";
import { createToast } from "../store/toastSlice.js";

export function useAuthForm({ 
    thunk,
    formOptions,
    successToast,
    successRedirect,
    clearOnError = true
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const form = useForm(formOptions);
    const { isSuccessful, isError, errorMessage } = useSelector(userSelector);

    useEffect(() => {
        if (isSuccessful) {
            if (successToast) {
                dispatch(createToast({
                    message: successToast,
                    type: "success"
                }))
            }
            dispatch(userStateReset());
            if (successRedirect) {
                navigate(successRedirect);
            }
        } else if (isError) {
            dispatch(createToast({
                message: errorMessage,
                type: "error"
            }))
            if (clearOnError) { dispatch(userStateReset()) }
        }
    }, [isSuccessful, isError, errorMessage, dispatch, navigate, 
        successRedirect, successToast, clearOnError
    ])

    const submit = (data) => dispatch(thunk(data));

    return { ...form, submit, isSuccessful, isError, errorMessage };
}