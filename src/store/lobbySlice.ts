import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI, LobbyAPI, PregameAPI } from '../services/api-functions';
import type { GameId, NewGamePayload } from '../services/api-functions';
import type { LobbyRoom, UserIdResponse } from '@shared/api';
import type { RootState } from './types';

export type FetchUserIdAndChipsResult = {
	idVal: number;
	chipsRes: number;
};

export type ResetUserChipsResult = {
	idRes: number;
	chipsRes: number;
};

export const fetchUserIdAndChips = createAsyncThunk<
	FetchUserIdAndChipsResult,
	void,
	{ rejectValue: unknown }
>('lobby/fetchUserId', async (_, thunkAPI) => {
	try {
		const [idRes, chipsRes] = await Promise.all([
			UserAPI.getUserId(),
			LobbyAPI.getUserChips(),
		]);
		const idVal = idRes.id;

		return { idVal, chipsRes };
	} catch (error) {
		return thunkAPI.rejectWithValue((error as { errorMsg?: unknown }).errorMsg);
	}
});

export const fetchGames = createAsyncThunk<LobbyRoom[], void>(
	'lobby/fetchGames',
	async () => {
		return await LobbyAPI.getGames();
	},
);

export const createNewGame = createAsyncThunk<LobbyRoom, NewGamePayload>(
	'lobby/createNewGame',
	async ({ roomName, playerCap, turnMax, betMax }) => {
		return await LobbyAPI.postNewGame(roomName, playerCap, turnMax, betMax);
	},
);

export const joinGame = createAsyncThunk<unknown, GameId>(
	'lobby/joinGame',
	async (gameId) => {
		return await PregameAPI.postJoinGame(gameId);
	},
);

export const resetUserChips = createAsyncThunk<ResetUserChipsResult, number, { rejectValue: unknown }>(
	'lobby/resetUserChips',
	async (chips, thunkAPI) => {
		try {
			await LobbyAPI.resetUserChips(chips);
			const [idRes, chipsRes] = await Promise.all([
				UserAPI.getUserId(),
				LobbyAPI.getUserChips(),
			]);
			return { idRes: idRes.id, chipsRes };
		} catch (error) {
			return thunkAPI.rejectWithValue((error as { errorMsg?: unknown }).errorMsg);
		}
	},
);

export type LobbyState = {
	userId: number | null;
	chips: number;
	isFetching: boolean;
	isSuccessful: boolean;
	isError: boolean;
	errorMessage: string;
	rooms: LobbyRoom[];
};

const initialLobbyState = (): LobbyState => ({
	userId: null,
	chips: 10000,
	isFetching: false,
	isSuccessful: false,
	isError: false,
	errorMessage: '',
	rooms: [],
});

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: initialLobbyState(),
	reducers: {
		lobbyStateReset(state) {
			const nextState = initialLobbyState();
			state.userId = nextState.userId;
			state.chips = nextState.chips;
			state.isFetching = nextState.isFetching;
			state.isSuccessful = nextState.isSuccessful;
			state.isError = nextState.isError;
			state.errorMessage = nextState.errorMessage;
			state.rooms = state.rooms;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserIdAndChips.fulfilled, (state, action) => {
			const { idVal, chipsRes } = action.payload;
			state.userId = idVal;
			state.chips = chipsRes;
			state.isFetching = false;
		});
		builder.addCase(fetchUserIdAndChips.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(fetchUserIdAndChips.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = typeof action.payload === 'string' ? action.payload : '';
		});
		builder.addCase(fetchGames.fulfilled, (state, action) => {
			state.isFetching = false;
			state.rooms = action.payload;
		});
		builder.addCase(fetchGames.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(fetchGames.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.error.message ?? '';
		});
		builder.addCase(createNewGame.fulfilled, (state, action) => {
			state.isFetching = false;
			state.isSuccessful = true;
			state.rooms = [...state.rooms, action.payload];
		});
		builder.addCase(createNewGame.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(createNewGame.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.error.message ?? '';
		});
		builder.addCase(joinGame.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(joinGame.fulfilled, (state) => {
			state.isFetching = false;
		});
		builder.addCase(joinGame.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.error.message ?? '';
		});
		builder.addCase(resetUserChips.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(resetUserChips.fulfilled, (state, action) => {
			const { idRes, chipsRes } = action.payload;
			state.userId = idRes;
			state.chips = chipsRes;
			state.isFetching = false;
		});
		builder.addCase(resetUserChips.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = typeof action.payload === 'string' ? action.payload : '';
		});
	},
});

export const { lobbyStateReset } = lobbySlice.actions;
export const lobbySelector = (state: RootState): LobbyState => state.lobby;

export type { UserIdResponse };

