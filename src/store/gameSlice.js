import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { GameAPI } from '../services';

const initialGameState = {
    currentTurn: 1,
    turnMax: 12,
    betMax: 500,
    totalBetAmount: 0,
    Players: [],
    cardBets: [],
    currentlySelectedCard: null,
    isPickDealer: null,
    pickDealerCards: [],
    cardsOnBoard: [],
    currentPhase: null,
    hasClicked: false,
    currentPlayer: null,
    currentDealer: null,
    playerAuth: null,
    gameId: null,
    isFetching: false,
	isError: false,
	errorMessage: "",
}

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
    initialState: initialGameState,
    reducers: {
        setGameId(state, action) {
            state.gameId = action.payload;
        },
        setCurrentSelection(state, action) {
            return {
                ...state,
                currentlySelectedCard: action.payload,
            }
        },
        setHasClicked(state, action) {
            state.hasClicked = action.payload;
        },
        setGameState(state, action) {
            state.betMax = action.payload.general_data.betMax;
            state.currentTurn = action.payload.general_data.currentTurn;
            state.turnMax = action.payload.general_data.turnMax;
            state.totalBetAmount = action.payload.general_data.currentOverallBet;
            state.isPickDealer = action.payload.general_data.isPickDealer;
            state.Players = action.payload.players_data;
            state.currentPlayer = action.payload.general_data.currentPlayer;
            state.currentPhase = action.payload.general_data.currentPhase;
            if (action.payload.general_data.currentDealer) {
                state.currentDealer = action.payload.general_data.currentDealer;
            }
            state.cardBets = action.payload.general_data.cardBets;
            state.cardsOnBoard = action.payload.general_data.cardsOnBoard;
            if (action.payload.general_data.pickDealerCardsArray && action.payload.general_data.pickDealerCardsArray.length > 0) {
                state.pickDealerCards = action.payload.general_data.pickDealerCardsArray;
            } else {
                state.pickDealerCards = [];
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPlayerAuth.fulfilled, (state, action) => {
            state.playerAuth = action.payload;
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

const selectCardBets = state => state.game.cardBets;
const selectCurrentDealer = state => state.game.currentDealer;
const selectPlayers = state => state.game.Players;
const selectPlayerId = state => state.game.playerAuth;

export const gameSelector = state => state.game;

export const selectPlayerCardBet = createSelector([selectCardBets, selectPlayerId], (cardBets, playerAuth) => {
    if (cardBets.length > 0) {
        return cardBets.find(bet => bet.userId === playerAuth.id);
    }
    return null;
})

export const selectCardOwnedBool = createSelector([selectCardBets, selectPlayerId], (cardBets, playerAuth) => {
    return cardBets.some(bet => bet.userId !== playerAuth.id);
})

export const selectIsDealerBool = createSelector([selectCurrentDealer, selectPlayerId], (currentDealer, playerAuth) => {
    return currentDealer.id === playerAuth.id;
})

export const selectPlayerStatus = createSelector([selectPlayers, selectPlayerId], (Players, playerAuth) => {
    return Players.find(player => player.id === playerAuth.id);
})

export const { setGameId,
    setCurrentSelection,
    setHasClicked,
    setGameState } = gameSlice.actions;