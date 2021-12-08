import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import LobbyAPI from '../services/api-functions.js';

export const fetchGames = createAsyncThunk(
	"lobby/fetchGames",
	async (_, thunkAPI) => {
		try {
			const response = await LobbyAPI.getGames();
			let { games } = response.data;
		
			if (response.status === 200) {
				return { games }
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

export const createNewGame = createAsyncThunk(
	"lobby/createNewGame",
	async ({roomName, playerCap, turnMax}, thunkAPI) => {
		try {
			const response = await LobbyAPI.postNewGame(roomName, playerCap, turnMax);
			let { game } = response.data;
			
			if (response.status === 200) {
				return { game }
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

const initialLobbyState = () => ({
	isSuccessful: false,
	isFetching: false,
	isError: false,
	errorMessage: "",
	rooms: {},
})

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: initialLobbyState(),
	reducers: {
		lobbyStateReset(state) {
			return {
				...initialLobbyState(),
				rooms: state.rooms
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchGames.fulfilled, (state, action) => {
			state.isFetching = false;
			state.rooms = action.payload;
		})
		builder.addCase(fetchGames.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(fetchGames.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
		builder.addCase(createNewGame.fulfilled, (state, action) => {
			state.isFetching = false;
			state.rooms = state.rooms.concat(action.payload)
		})
		builder.addCase(createNewGame.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(createNewGame.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
	},
});

export const { lobbyStateReset } = lobbySlice.actions;
export const lobbySelector = state => state.lobby;