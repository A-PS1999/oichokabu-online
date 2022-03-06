import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GameAPI } from '../services';

const initialGameState = () => ({
    currentTurn: 1,
    turnMax: null,
    betMax: 500,
    Players: [],
    cardSelections: [],
    isPickDealer: true,
    currentDealer: null,
    playerId: null,
    isFetching: false,
	isError: false,
	errorMessage: "",
})

export const fetchPlayerAuth = createAsyncThunk(
    "game/fetchPlayerAuth",
    async (gameId, thunkAPI) => {
        try {
            const response = await GameAPI.getPlayerAuth(gameId);
            let playerData = response.data;

            if (response.status === 200) {
                return playerData;
            } else {
                throw thunkAPI.rejectWithValue(response.status)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState(),
    reducers: {
        setGameValues(state, action) {
            state.Players = action.payload.player_data;
            state.turnMax = action.payload.turn_max;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPlayerAuth.fulfilled, (state, action) => {
            state.playerId = action.payload.id;
            state.isFetching = false;
        })
        builder.addCase(fetchPlayerAuth.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(fetchPlayerAuth.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
    }
})

export const gameSelector = state => state.game;
export const { setGameValues } = gameSlice.actions;