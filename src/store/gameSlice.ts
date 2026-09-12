import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { GameAPI } from '../services';
import type { CardBetRequestBody, GameId } from '../services/api-functions';
import type { PlayerAuth } from '@shared/api';
import type {
	CardBet,
	CardBetView,
	CardColumn,
	GameDataView,
	Phase,
	PickDealerReveal,
	Player,
	PlayerDataView,
	RoundResult,
} from '@shared/game';
import type { RootState } from './types';

export type PickDealerCardView = {
	id: number;
	value?: number;
	src: string;
};

export type GameSliceState = {
	currentTurn: number;
	turnMax: number;
	betMax: number;
	totalBetAmount: number;
	Players: PlayerDataView[];
	cardBets: ReadonlyArray<CardBetView>;
	currentlySelectedCard: { id: number; ownerColumn: number } | null;
	isPickDealer: boolean | null;
	pickDealerCards: ReadonlyArray<PickDealerCardView>;
	cardsOnBoard: ReadonlyArray<CardColumn>;
	currentPhase: Phase | null;
	phaseEnteredAt: number | null;
	phaseDurationMs: number | null;
	pickDealerReveals: readonly PickDealerReveal[];
	lastRoundResult: RoundResult | null;
	hasClicked: boolean;
	currentPlayer: Player | null;
	currentDealer: Player | null;
	playerAuth: PlayerAuth | null;
	gameId: string | null;
	isFetching: boolean;
	isError: boolean;
	errorMessage: string;
};

const initialGameState: GameSliceState = {
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
	phaseEnteredAt: null,
	phaseDurationMs: null,
	pickDealerReveals: [],
	lastRoundResult: null,
	hasClicked: false,
	currentPlayer: null,
	currentDealer: null,
	playerAuth: null,
	gameId: null,
	isFetching: false,
	isError: false,
	errorMessage: '',
};

export const fetchPlayerAuth = createAsyncThunk<PlayerAuth, GameId>(
	'game/fetchPlayerAuth',
	async (gameId) => {
		return await GameAPI.getPlayerAuth(gameId);
	},
);

export type PostCardBetArgs = {
	gameId: GameId;
	betData: CardBetRequestBody;
};

export const postCardBet = createAsyncThunk<void, PostCardBetArgs>(
	'game/postCardBet',
	async ({ gameId, betData }) => {
		return await GameAPI.postCardBet(gameId, betData);
	},
);

export type PostThirdCardChoiceArgs = {
	gameId: GameId;
	choiceMade: string;
	isDealer: boolean;
};

export const postThirdCardChoice = createAsyncThunk<void, PostThirdCardChoiceArgs>(
	'game/postThirdCardChoice',
	async ({ gameId, choiceMade, isDealer }) => {
		return await GameAPI.postThirdCardChoice(gameId, choiceMade, isDealer);
	},
);

export type PostDealerCardSelectedArgs = {
	gameId: GameId;
	cardId: number;
};

export const postDealerCardSelected = createAsyncThunk<void, PostDealerCardSelectedArgs>(
	'game/postDealerCardSelected',
	async ({ gameId, cardId }) => {
		return await GameAPI.postDealerCardSelected(gameId, cardId);
	},
);

export const gameSlice = createSlice({
	name: 'game',
	initialState: initialGameState,
	reducers: {
		setGameId(state, action: PayloadAction<string>) {
			if (state.gameId !== action.payload) {
				return { ...initialGameState, gameId: action.payload };
			}
			state.gameId = action.payload;
		},
		setCurrentSelection(state, action: PayloadAction<{ id: number; ownerColumn: number }>) {
			state.currentlySelectedCard = action.payload;
		},
		setHasClicked(state, action: PayloadAction<boolean>) {
			state.hasClicked = action.payload;
		},
		setGameState(state, action: PayloadAction<GameDataView>) {
			const { general_data, players_data } = action.payload;
			state.betMax = general_data.betMax;
			state.currentTurn = general_data.currentTurn;
			state.turnMax = general_data.turnMax;
			state.totalBetAmount = general_data.currentOverallBet;
			state.isPickDealer = general_data.isPickDealer;
			state.Players = players_data;
			state.currentPlayer = general_data.currentPlayer;
			state.currentPhase = general_data.currentPhase;
			if (general_data.currentDealer) {
				state.currentDealer = general_data.currentDealer;
			}
			state.cardBets = [...general_data.cardBets];
			state.cardsOnBoard = [...general_data.cardsOnBoard];
			state.phaseEnteredAt = general_data.phaseEnteredAt;
			state.phaseDurationMs = general_data.phaseDurationMs;
			state.pickDealerReveals = general_data.pickDealerReveals ? [...general_data.pickDealerReveals] : [];
			state.lastRoundResult = general_data.lastRoundResult
				? { ...general_data.lastRoundResult, results: [...general_data.lastRoundResult.results] }
				: null;
			if (general_data.pickDealerCardsArray && general_data.pickDealerCardsArray.length > 0) {
				state.pickDealerCards = [...general_data.pickDealerCardsArray];
			} else {
				state.pickDealerCards = [];
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchPlayerAuth.fulfilled, (state, action) => {
			state.playerAuth = action.payload;
			state.isFetching = false;
		});
		builder.addCase(fetchPlayerAuth.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(fetchPlayerAuth.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.error.message ?? '';
		});
	},
});

const selectCardBets = (state: RootState): ReadonlyArray<CardBetView> => state.game.cardBets;
const selectCurrentDealer = (state: RootState): Player | null => state.game.currentDealer;
export const selectPlayers = (state: RootState): PlayerDataView[] => state.game.Players;
const selectPlayerId = (state: RootState): PlayerAuth | null => state.game.playerAuth;

export const selectCurrentTurn = (state: RootState): number => state.game.currentTurn;
export const selectTurnMax = (state: RootState): number => state.game.turnMax;
export const selectBetMax = (state: RootState): number => state.game.betMax;
export const selectTotalBetAmount = (state: RootState): number => state.game.totalBetAmount;
export const selectCurrentlySelectedCard = (state: RootState): { id: number; ownerColumn: number } | null =>
	state.game.currentlySelectedCard;
export const selectIsPickDealer = (state: RootState): boolean | null => state.game.isPickDealer;
export const selectPickDealerCards = (state: RootState): ReadonlyArray<PickDealerCardView> =>
	state.game.pickDealerCards;
export const selectCardsOnBoard = (state: RootState): ReadonlyArray<CardColumn> => state.game.cardsOnBoard;
export const selectCurrentPhase = (state: RootState): Phase | null => state.game.currentPhase;
export const selectPhaseEnteredAt = (state: RootState): number | null => state.game.phaseEnteredAt;
export const selectPhaseDurationMs = (state: RootState): number | null => state.game.phaseDurationMs;
export const selectPickDealerReveals = (state: RootState): readonly PickDealerReveal[] =>
	state.game.pickDealerReveals;
export const selectLastRoundResult = (state: RootState): RoundResult | null => state.game.lastRoundResult;
export const selectHasClicked = (state: RootState): boolean => state.game.hasClicked;
export const selectCurrentPlayer = (state: RootState): Player | null => state.game.currentPlayer;
export const selectCurrentDealerData = (state: RootState): Player | null => state.game.currentDealer;
export const selectPlayerAuth = (state: RootState): PlayerAuth | null => state.game.playerAuth;
export const selectGameId = (state: RootState): string | null => state.game.gameId;
export const selectGameIsError = (state: RootState): boolean => state.game.isError;
export const selectGameErrorMessage = (state: RootState): string => state.game.errorMessage;

export const gameSelector = (state: RootState): GameSliceState => state.game;

export const selectPlayerCardBet = createSelector([selectCardBets, selectPlayerId], (cardBets, playerAuth) => {
	if (cardBets.length > 0 && playerAuth) {
		const bet = cardBets.find((bet) => bet.userId === playerAuth.id);
		if (bet && 'ownerColumn' in bet) {
			return bet as CardBet;
		}
	}
	return null;
});

export const selectCardOwnedBool = createSelector([selectCardBets, selectPlayerId], (cardBets, playerAuth) => {
	return cardBets.some((bet) => bet.userId !== playerAuth?.id);
});

export const selectIsDealerBool = createSelector([selectCurrentDealer, selectPlayerId], (currentDealer, playerAuth) => {
	return currentDealer?.id === playerAuth?.id;
});

export const selectPlayerStatus = createSelector([selectPlayers, selectPlayerId], (players, playerAuth) => {
	return players.find((player) => player.id === playerAuth?.id);
});

export const {
	setGameId,
	setCurrentSelection,
	setHasClicked,
	setGameState,
} = gameSlice.actions;


