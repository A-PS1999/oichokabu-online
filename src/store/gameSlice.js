import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GameAPI } from '../services';

const initialGameState = () => ({
    currentTurn: 1,
    turnMax: 12,
    betMax: 500,
    totalBetAmount: 0,
    Players: [],
    cardBets: [],
    currentlySelectedCard: null,
    isPickDealer: true,
    hasClicked: false,
    currentDealer: null,
    playerId: null,
    gameId: null,
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
            state.betMax = action.payload.bet_max;
            state.gameId = action.payload.game_id;
        },
        setCardBet(state, action) {
            state.cardBets.push(action.payload);
        },
        setCurrentSelection(state, action) {
            return {
                ...state,
                currentlySelectedCard: action.payload,
            }
        },
        setHasClicked(state) {
            return {
                ...state,
                hasClicked: true,
            }
        },
        prepMainGameInitialState(state, action) {
            return {
                ...state,
                isPickDealer: false,
                hasClicked: false,
                currentDealer: action.payload,
                cardBets: [],
            }
        },
        handleCardBetMade(state, action) {
            const index = state.Players.findIndex((i) => i.id === action.payload.betAmount.user_id);
            state.totalBetAmount += action.payload.betAmount.betAmount;
            state.Players[index].user_chips -= action.payload.betAmount.betAmount;
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
export const { setGameValues, 
    setCardBet,
    setCurrentSelection, 
    setHasClicked, 
    prepMainGameInitialState,
    handleCardBetMade } = gameSlice.actions;