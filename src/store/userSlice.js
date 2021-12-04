import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api.js';

export const registerUser = createAsyncThunk(
	"users/registerUser",
	async ({ username, email, password, confirmPassword }, thunkAPI) => {
		try {
			if (password !== confirmPassword) {
				throw thunkAPI.rejectWithValue("Password entries do not match")
			}
			
			const response = await API.post('/register', { username, email, password })
			let { auth } = response.data;
		
			if (response.status === 200) {
				return { ...auth, username: username, email: email, password: password }
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

export const loginUser = createAsyncThunk(
	"users/login",
	async ({ username, password }, thunkAPI) => {
		try {
			const response = await API.post('/log-in', { username, password })
			let data = response.data;
			
			if (response.status === 200) {
				return data
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		isFetching: false,
		isSuccessful: false,
		isError: false,
		errorMessage: "",
	},
	reducers: {
		
	},
	extraReducers: (builder) => {
		builder.addCase(registerUser.fulfilled, (state, action) => {
			state.isFetching = false;
			state.isSuccessful = true;
			state.username = action.payload.username;
			state.email = action.payload.email;
			state.password = action.payload.password;
		})
		builder.addCase(registerUser.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(registerUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.isFetching = false;
			state.isSuccessful = true;
			state.username = action.payload.username;
			state.password = action.payload.password;
		})
		builder.addCase(loginUser.pending, (state) => {
			state.isPending = true;
		})
		builder.addCase(loginUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
	},
});

export const userSelector = state => state.user;