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