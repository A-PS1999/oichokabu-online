import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api.js';

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

export const logoutUser = createAsyncThunk(
	"users/logout",
	async (_, thunkAPI) => {
		try {
			const response = await API.post('/log-out');
			if (response.status === 200) {
				return null;
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

export const getSessID = createAsyncThunk(
	"users/getSessId",
	async (_, thunkAPI) => {
		try {
			const response = await API.post('/get-session')
			if (response.status === 200 && response.data.result.sid != null) {
				return null;
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
)

const initialUserSliceState = () => ({
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
	isLoggedIn: false,
	isFetching: false,
	isSuccessful: false,
	isError: false,
	errorMessage: "",
})

export const userSlice = createSlice({
	name: 'user',
	initialState: initialUserSliceState(),
	reducers: {
		userStateReset: (state) => initialUserSliceState(),
		toggleLoggedIn(state) {
			return {
				...state,
				isLoggedIn: !state.isLoggedIn
			}
		}
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
		builder.addCase(logoutUser.fulfilled, (state) => {
			state.isLoggedIn = false;
			state.isSuccessful = true;
		})
		builder.addCase(logoutUser.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(logoutUser.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
		builder.addCase(getSessID.fulfilled, (state) => {
			state.isFetching = false;
			state.isLoggedIn = true;
		})
		builder.addCase(getSessID.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(getSessID.rejected, (state, action) => {
			state.isFetching = false;
		})
	},
});

export const { userStateReset, toggleLoggedIn } = userSlice.actions;
export const userSelector = state => state.user;