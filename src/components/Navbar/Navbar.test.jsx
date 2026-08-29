import { render, screen, cleanup } from '@testing-library/react';
import { server } from '../../mocks/server';
import { serverAddress } from '../../settings';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FrontPage from '../FrontPage/FrontPage';
import Login from '../Login/Login';
import Lobby from '../Lobby/Lobby';
import SignUp from '../SignUp/SignUp';

beforeEach(() => {
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/log-in" element={<Login />} />
                    <Route path="/lobby" element={<Lobby />} />
                    <Route path="/register" element={<SignUp />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )
})
afterEach(() => {
    cleanup();
})

describe('Navbar', () => {

    it("renders with 'Lobby' and 'Log Out' when session exists", async () => {
        await screen.findByText("Lobby");
        await screen.findByText("Log Out");
    })

    it("renders with 'Sign Up' and 'Log In' when no session exists", async () => {
        server.use(
            rest.post(`${serverAddress}/api/get-session`, (req, res, ctx) => {
                return res(
                    ctx.json({ session: 'No session' })
                )
            })
        )
        await screen.findByText("Sign Up");
        await screen.findByText("Log In");
    })

    it("directs to lobby when 'Lobby' clicked", async () => {
        await userEvent.click(getLobbyLink());

        await screen.findByText("Create or join a game!");
    })

    it("directs to front page when 'Oicho Kabu Online' clicked", async () => {
        await userEvent.click(getLobbyLink());
        await screen.findByText("Create or join a game!");

        await userEvent.click(getFrontPageLink());
        await screen.findByText("What is Oicho Kabu?");
    })

    it("directs to front page and changes navbar buttons when 'Log Out' clicked", async () => {
        await userEvent.click(getLobbyLink());
        await screen.findByText("Create or join a game!");

        await userEvent.click(getLogoutLink());
        await screen.findByText("Log In");
        await screen.findByText("What is Oicho Kabu?");
    })

    it('directs to login and sign up page when respective links clicked', async () => {
        server.use(
            rest.post(`${serverAddress}/api/get-session`, (req, res, ctx) => {
                return res(
                    ctx.json({ session: 'No session' })
                )
            })
        )
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