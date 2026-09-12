import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API, refreshSocketConnection } from '../services';
import type { AuthUser } from '@shared/api';
import type { RootState } from './types';

export type RegisterArgs = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type RegisterResult = {
	username: string;
	email: string;
	password: string;
	[key: string]: unknown;
};

export type LoginArgs = {
	username: string;
	password: string;
};

export type LoginResult = {
	username: string;
};

export type ForgotPasswordArgs = {
	email: string;
};

export type ResetPasswordArgs = {
	token: string;
	password: string;
	confirmPassword: string;
};

export type VerifyResetPasswordArgs = {
	token: string;
};

export const registerUser = createAsyncThunk<RegisterResult, RegisterArgs, { rejectValue: string }>(
	'users/registerUser',
	async ({ username, email, password, confirmPassword }, thunkAPI) => {
		if (password !== confirmPassword) {
			throw thunkAPI.rejectWithValue('Password entries do not match');
		}

		const response = await API.post<{ auth: AuthUser }>('/register', { username, email, password });

		refreshSocketConnection();
		return { ...response.auth, username, email, password };
	},
);

export const loginUser = createAsyncThunk<LoginResult, LoginArgs, { rejectValue: string }>(
	'users/login',
	async ({ username, password }) => {
		const response = await API.post<LoginResult>('/log-in', { username, password });

		refreshSocketConnection();
		return response;
	},
);

export const logoutUser = createAsyncThunk<unknown, void, { rejectValue: string }>(
	'users/logout',
	async () => {
		return await API.post('/log-out');
	},
);

export const submitForgotPassword = createAsyncThunk<unknown, ForgotPasswordArgs, { rejectValue: string }>(
	'users/sendPasswordResetEmail',
	async ({ email }) => {
		return await API.post('/forgot-password', { email });
	},
);

export const resetPassword = createAsyncThunk<null, ResetPasswordArgs, { rejectValue: string }>(
	'users/resetPassword',
	async ({ token, password, confirmPassword }, thunkAPI) => {
		try {
			if (password !== confirmPassword) {
				return thunkAPI.rejectWithValue('Password entries do not match');
			}

			const response = await API.post<{ status?: number }>(`/reset-password/${token}`, { password });

			if (response.status === 201) {
				return null;
			}
			return null;
		} catch (error) {
			return thunkAPI.rejectWithValue(error instanceof Error ? error.message : String(error));
		}
	},
);

export const verifyResetPassword = createAsyncThunk<null, VerifyResetPasswordArgs, { rejectValue: string }>(
	'users/verifyResetPassword',
	async ({ token }, thunkAPI) => {
		try {
			const response = await API.get<{ status?: number }>(`/reset-password/${token}`);

			if (response.status === 201) {
				return null;
			}
			return null;
		} catch (error) {
			return thunkAPI.rejectWithValue(error instanceof Error ? error.message : String(error));
		}
	},
);

export const getSessID = createAsyncThunk<null, void, { rejectValue: string }>(
	'users/getSessId',
	async (_, thunkAPI) => {
		const response = await API.post<{ authenticated: boolean }>('/get-session');
		if (response.authenticated) {
			return null;
		}
		return thunkAPI.rejectWithValue('No active session');
	},
);

export type UserState = {
	username: string;
	email: string;
	sessionStatus: string;
	isFetching: boolean;
	isSuccessful: boolean;
	isError: boolean;
	errorMessage: string;
};

const initialUserSliceState = (): UserState => ({
	username: '',
	email: '',
	sessionStatus: 'idle',
	isFetching: false,
	isSuccessful: false,
	isError: false,
	errorMessage: '',
});

export const userSlice = createSlice({
	name: 'user',
	initialState: initialUserSliceState(),
	reducers: {
		userStateReset: (state) => {
			state.username = '';
			state.email = '';
			state.isFetching = false;
			state.isSuccessful = false;
			state.isError = false;
			state.errorMessage = '';
		},
	},
	extraReducers: (builder) => {
		builder.addCase(registerUser.fulfilled, (state, action) => {
			state.isFetching = false;
			state.isSuccessful = true;
			state.sessionStatus = 'authenticated';
			state.username = action.payload.username;
			state.email = action.payload.email;
		});
		builder.addCase(registerUser.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(registerUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload ?? '';
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.sessionStatus = 'authenticated';
			state.isFetching = false;
			state.isSuccessful = true;
			state.username = action.payload.username;
		});
		builder.addCase(loginUser.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(loginUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = `${action.payload}: Username or password may be incorrect.`;
		});
		builder.addCase(logoutUser.fulfilled, (state) => {
			state.username = '';
			state.email = '';
			state.sessionStatus = 'unauthenticated';
			state.isFetching = false;
			state.isSuccessful = true;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(logoutUser.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(logoutUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload ?? '';
		});
		builder.addCase(submitForgotPassword.fulfilled, (state) => {
			state.isFetching = false;
			state.isSuccessful = true;
		});
		builder.addCase(submitForgotPassword.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(submitForgotPassword.rejected, (state, action) => {
			state.isError = true;
			state.isFetching = false;
			state.errorMessage = action.payload ?? '';
		});
		builder.addCase(resetPassword.fulfilled, (state) => {
			state.isSuccessful = true;
			state.isFetching = false;
		});
		builder.addCase(resetPassword.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(resetPassword.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload ?? '';
		});
		builder.addCase(verifyResetPassword.fulfilled, (state) => {
			state.isFetching = false;
		});
		builder.addCase(verifyResetPassword.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(verifyResetPassword.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload ?? '';
		});
		builder.addCase(getSessID.fulfilled, (state) => {
			state.sessionStatus = 'authenticated';
			state.isFetching = false;
		});
		builder.addCase(getSessID.pending, (state) => {
			state.sessionStatus = 'checking';
			state.isFetching = true;
		});
		builder.addCase(getSessID.rejected, (state) => {
			state.sessionStatus = 'unauthenticated';
			state.isFetching = false;
		});
	},
});

export const { userStateReset } = userSlice.actions;
export const userSelector = (state: RootState): UserState => state.user;
export const sessionStatusSelector = (state: RootState): string => state.user.sessionStatus;

