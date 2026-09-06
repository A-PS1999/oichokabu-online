import { screen, cleanup } from '@testing-library/react';
import { server } from '../../mocks/server';
import { serverAddress } from '../../settings';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import FrontPage from '../FrontPage/FrontPage';
import Login from '../Login/Login';
import Lobby from '../Lobby/Lobby';
import SignUp from '../SignUp/SignUp';

const testRoutes = [
    { path: "/", element: <FrontPage /> },
    { path: "/log-in", element: <Login /> },
    { path: "/lobby", element: <Lobby /> },
    { path: "/register", element: <SignUp /> },
];

const authenticatedState = {
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

const unauthenticatedState = {
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

describe('Navbar', () => {

    it("renders with 'Lobby' and 'Log Out' when session exists", async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: authenticatedState,
        })

        await screen.findByText("Lobby");
        await screen.findByText("Log Out");
    })

    it("renders with 'Sign Up' and 'Log In' when no session exists", async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: unauthenticatedState,
        })

        await screen.findByText("Sign Up");
        await screen.findByText("Log In");
    })

    it("directs to lobby when 'Lobby' clicked", async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: authenticatedState,
        })

        await userEvent.click(getLobbyLink());

        await screen.findByText("Create or join a game!");
    })

    it("directs to front page when 'Oicho Kabu Online' clicked", async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: authenticatedState,
        })

        await userEvent.click(getLobbyLink());
        await screen.findByText("Create or join a game!");

        await userEvent.click(getFrontPageLink());
        await screen.findByText("What is Oicho Kabu?");
    })

    it("directs to front page and changes navbar buttons when 'Log Out' clicked", async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: authenticatedState,
        })

        await userEvent.click(getLobbyLink());
        await screen.findByText("Create or join a game!");

        await userEvent.click(getLogoutLink());
        await screen.findByText("What is Oicho Kabu?");
        await screen.findByText("Log In");
    })

    it('directs to login and sign up page when respective links clicked', async () => {
        renderWithProviders(null, {
            initialEntries: ["/"],
            routes: testRoutes,
            preloadedState: unauthenticatedState,
        })

        await userEvent.click(getLoginLink());
        await screen.findByText("Forgotten your password?");

        await userEvent.click(getSignUpLink());
        await screen.findByRole('heading', { level: 2, name: /sign up/i })
    })
})

function getLoginLink() {
    return screen.getByRole('link', { name: /log in/i })
}

function getLogoutLink() {
    return screen.getByRole('link', { name: /log out/i })
}

function getLobbyLink() {
    return screen.getByRole('link', { name: /lobby/i })
}

function getSignUpLink() {
    return screen.getByRole('link', { name: /sign up/i })
}

function getFrontPageLink() {
    return screen.getByRole('link', { name: /oicho kabu online/i })
}