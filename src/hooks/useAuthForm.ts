import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { userSelector, userStateReset } from '../store/userSlice';
import { createToast } from '../store/toastSlice';
import { useAppDispatch } from '../store/hooks';
import type { AppDispatch } from '../store/store';

export type UseAuthFormArgs<TFieldValues extends FieldValues> = {
	thunk: (data: TFieldValues) => unknown;
	formOptions?: UseFormProps<TFieldValues>;
	successToast?: string;
	successRedirect?: string;
	clearOnError?: boolean;
};

export function useAuthForm<TFieldValues extends FieldValues = FieldValues>({
	thunk,
	formOptions,
	successToast,
	successRedirect,
	clearOnError = true,
}: UseAuthFormArgs<TFieldValues>) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const form = useForm<TFieldValues>(formOptions);
	const { isSuccessful, isError, errorMessage } = useSelector(userSelector);

	useEffect(() => {
		if (isSuccessful) {
			if (successToast) {
				dispatch(
					createToast({
						message: successToast,
						type: 'success',
					}),
				);
			}
			dispatch(userStateReset());
			if (successRedirect) {
				navigate(successRedirect);
			}
		} else if (isError) {
			dispatch(
				createToast({
					message: errorMessage,
					type: 'error',
				}),
			);
			if (clearOnError) {
				dispatch(userStateReset());
			}
		}
	}, [isSuccessful, isError, errorMessage, dispatch, navigate, successRedirect, successToast, clearOnError]);

	const submit = (data: TFieldValues): void => {
		dispatch(thunk(data) as Parameters<AppDispatch>[0]);
	};

	return { ...form, submit, isSuccessful, isError, errorMessage };
}
