import { render, screen, cleanup } from '@testing-library/react';
import { server } from '../../mocks/server';
import { serverAddress } from '../../settings';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ToastPortal from '../../components/Toast/ToastPortal';
import Login from './Login';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import Lobby from '../Lobby/Lobby';

beforeEach(() => {
    render(
        <Provider store={store}>
            <ToastPortal />
            <MemoryRouter initialEntries={["/log-in"]}>
                <Routes>
                    <Route path="/log-in" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/lobby" element={<Lobby />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )
});
afterEach(() => {
    cleanup();
})

describe('Login', () => {
    const loginDetails = { username: "test_user", password: "testpass" };

    it('redirects the user when successful', async () => {
        userEvent.type(getUserInput(), loginDetails.username);
        userEvent.type(getPasswordInput(), loginDetails.password);
        userEvent.click(getSubmitBtn());

        await screen.findByText("Create or join a game!")
    })

    it('returns a toast notification when unsuccessful', async () => {
        server.use(
            rest.post(`${serverAddress}/api/log-in`, (req, res, ctx) => {
                return res(
                    ctx.status(503),
                    ctx.json({ message: "Error" })
                )
            })
        )

        userEvent.type(getUserInput(), loginDetails.username);
        userEvent.type(getPasswordInput(), "wrongpass");
        userEvent.click(getSubmitBtn());

        await screen.findByText("Request failed with status code 503: Username or password may be incorrect.");
    })

    it('goes to forgot password page on link click', () => {
        const forgotPasswordLink = screen.getByRole('link', { name: /click here/i });
        userEvent.click(forgotPasswordLink);

        screen.findByText("Reset Your Password");
    })
})

function getUserInput() {
    return screen.getByPlaceholderText("Username");
}

function getPasswordInput() {
    return screen.getByPlaceholderText("Password");
}

function getSubmitBtn() {
    return screen.getByRole('button', { name: /submit/i });
}