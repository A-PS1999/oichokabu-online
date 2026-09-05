import { screen, cleanup } from '@testing-library/react';
import { server } from '../../mocks/server';
import { serverAddress } from '../../settings';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import Login from './Login';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import Lobby from '../Lobby/Lobby';

const testRoutes = [
    { path: "/log-in", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/lobby", element: <Lobby /> },
];

beforeEach(() => {
    renderWithProviders(null, {
        initialEntries: ["/log-in"],
        routes: testRoutes,
    })
});
afterEach(() => {
    cleanup();
})

describe('Login', () => {
    const loginDetails = { username: "test_user", password: "testpass" };

    it('redirects the user when successful', async () => {
        await userEvent.type(getUserInput(), loginDetails.username);
        await userEvent.type(getPasswordInput(), loginDetails.password);
        await userEvent.click(getSubmitBtn());

        await screen.findByText("Create or join a game!")
    })

    it('returns a toast notification when unsuccessful', async () => {
        server.use(
            http.post(`${serverAddress}/api/log-in`, () => {
                return HttpResponse.json(
                    { message: "Error" },
                    { status: 503 }
                )
            })
        )

        await userEvent.type(getUserInput(), loginDetails.username);
        await userEvent.type(getPasswordInput(), "wrongpass");
        await userEvent.click(getSubmitBtn());

        const toasts = await screen.findAllByText("undefined: Username or password may be incorrect.");
        expect(toasts.length).toBeGreaterThanOrEqual(1);
    })

    it('goes to forgot password page on link click', async () => {
        const forgotPasswordLink = screen.getByRole('link', { name: /click here/i });
        await userEvent.click(forgotPasswordLink);

        await screen.findByText("Reset Your Password");
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