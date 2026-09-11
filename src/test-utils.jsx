import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './store/userSlice';
import { lobbySlice } from './store/lobbySlice';
import { toastSlice } from './store/toastSlice';
import { modalSlice } from './store/modalSlice';
import { pregameSlice } from './store/pregameSlice';
import { gameSlice } from './store/gameSlice';
import { toastMiddleware } from './store/middleware';
import ToastPortal from './components/Toast/ToastPortal';
import Game from './components/Game/Game';

export const authenticatedState = {
    user: {
        username: "test_user",
        email: "",
        sessionStatus: "authenticated",
        isFetching: false,
        isSuccessful: false,
        isError: false,
        errorMessage: "",
    }
};

export const unauthenticatedState = {
    user: {
        username: "",
        email: "",
        sessionStatus: "unauthenticated",
        isFetching: false,
        isSuccessful: false,
        isError: false,
        errorMessage: "",
    }
};

function createTestStore(preloadedState) {
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
        preloadedState,
    })
}

export function renderWithProviders(ui, {
    initialEntries = ['/'],
    routes = [{ path: '/', element: ui }],
    preloadedState,
} = {}) {
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
        </Provider>
    )
}

export function createGameState(overrides = {}) {
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
            hasClicked: false,
            currentPlayer: null,
            currentDealer: null,
            playerAuth: null,
            gameId: null,
            isFetching: false,
            isError: false,
            errorMessage: "",
            ...overrides,
        },
    };
}

export function renderGame({
    preloadedState = {},
    gameId = "1",
    routes = [],
    initialEntries,
    element = <Game />,
} = {}) {
    const gameOverrides = preloadedState.game || {};
    const gameState = createGameState({
        ...gameOverrides,
        gameId: gameOverrides.gameId ?? gameId,
    });
    const fullState = {
        ...preloadedState,
        game: gameState.game,
    };
    const defaultEntries = initialEntries || [`/game/${gameId}`];
    const defaultRoutes = [
        { path: "/game/:gameId", element },
        { path: "/lobby", element: <div data-testid="lobby-nav">LOBBY</div> },
        ...routes,
    ];
    return renderWithProviders(null, {
        initialEntries: defaultEntries,
        routes: defaultRoutes,
        preloadedState: fullState,
    });
}