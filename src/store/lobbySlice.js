import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI, LobbyAPI } from '../services/api-functions.js';

export const fetchUserIdAndChips = createAsyncThunk(
	"lobby/fetchUserId",
	async () => {
		const [idRes, chipsRes]= await Promise.all([
			UserAPI.getUserId(),
			LobbyAPI.getUserChips()
		]);

		return { idRes, chipsRes };
	}
);

export const fetchGames = createAsyncThunk(
	"lobby/fetchGames",
	async () => {
		return await LobbyAPI.getGames();
	}
);

export const createNewGame = createAsyncThunk(
	"lobby/createNewGame",
	async ({ roomName, playerCap, turnMax, betMax }) => {
		return await LobbyAPI.postNewGame(roomName, playerCap, turnMax, betMax);
	}
);

const initialLobbyState = () => ({
	userId: null,
	chips: 10000,
	isFetching: false,
	isError: false,
	errorMessage: "",
	rooms: [],
})

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: initialLobbyState(),
	reducers: {
		lobbyStateReset(state) {
			const nextState = initialLobbyState();
			state.userId = nextState.userId;
			state.chips = nextState.chips;
			state.isFetching = nextState.isFetching;
			state.isError = nextState.isError;
			state.errorMessage = nextState.errorMessage;
			state.rooms = state.rooms;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserIdAndChips.fulfilled, (state, action) => {
			state.userId = action.payload.idResult;
			state.chips = action.payload.chipsResult;
			state.isFetching = false;
		})
		builder.addCase(fetchUserIdAndChips.pending, (state, action) => {
			state.isFetching = true;
		})
		builder.addCase(fetchUserIdAndChips.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
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
			state.rooms = [...state.rooms, action.payload.game];
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