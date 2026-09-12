import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './store/userSlice';
import { lobbySlice } from './store/lobbySlice';
import { toastSlice } from './store/toastSlice';
import { modalSlice } from './store/modalSlice';
import { pregameSlice } from './store/pregameSlice';
import { gameSlice, type GameSliceState } from './store/gameSlice';
import { toastMiddleware } from './store/middleware';
import ToastPortal from './components/Toast/ToastPortal';
import Game from './components/Game/Game';
import type { RootState } from './store/types';
import type { ReactElement } from 'react';

export const authenticatedState = {
	user: {
		username: 'test_user',
		email: '',
		sessionStatus: 'authenticated',
		isFetching: false,
		isSuccessful: false,
		isError: false,
		errorMessage: '',
	},
};

export const unauthenticatedState = {
	user: {
		username: '',
		email: '',
		sessionStatus: 'unauthenticated',
		isFetching: false,
		isSuccessful: false,
		isError: false,
		errorMessage: '',
	},
};

function createTestStore(preloadedState?: Partial<RootState>) {
	return configureStore({
		reducer: {
			user: userSlice.reducer,
			toasts: toastSlice.reducer,
			modal: modalSlice.reducer,
			lobby: lobbySlice.reducer,
			pregame: pregameSlice.reducer,
			game: gameSlice.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().prepend(toastMiddleware.middleware),
		preloadedState: preloadedState as RootState | undefined,
	});
}

export type TestRoute = {
	path: string;
	element: ReactElement | null;
};

export type RenderWithProvidersOptions = {
	initialEntries?: string[];
	routes?: TestRoute[];
	preloadedState?: Partial<RootState>;
};

export function renderWithProviders(
	ui: ReactElement | null,
	{
		initialEntries = ['/'],
		routes = [{ path: '/', element: ui }],
		preloadedState,
	}: RenderWithProvidersOptions = {},
) {
	const store = createTestStore(preloadedState);
	return render(
		<Provider store={store}>
			<ToastPortal />
			<MemoryRouter initialEntries={initialEntries}>
				<Routes>
					{routes.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}
				</Routes>
			</MemoryRouter>
		</Provider>,
	);
}

export function createGameState(overrides: Partial<GameSliceState> = {}): { game: GameSliceState } {
	return {
		game: {
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
			...overrides,
		},
	};
}

export type RenderGameOptions = {
	preloadedState?: Partial<RootState>;
	gameId?: string;
	routes?: TestRoute[];
	initialEntries?: string[];
	element?: ReactElement | null;
};

export function renderGame({
	preloadedState = {},
	gameId = '1',
	routes = [],
	initialEntries,
	element = <Game />,
}: RenderGameOptions = {}) {
	const gameOverrides: Partial<GameSliceState> = preloadedState.game ?? {};
	const gameState = createGameState({
		...gameOverrides,
		gameId: gameOverrides.gameId ?? gameId,
	});
	const fullState: Partial<RootState> = {
		...preloadedState,
		game: gameState.game,
	};
	const defaultEntries = initialEntries ?? [`/game/${gameId}`];
	const defaultRoutes: TestRoute[] = [
		{ path: '/game/:gameId', element },
		{ path: '/lobby', element: <div data-testid="lobby-nav">LOBBY</div> },
		...routes,
	];
	return renderWithProviders(null, {
		initialEntries: defaultEntries,
		routes: defaultRoutes,
		preloadedState: fullState,
	});
}

