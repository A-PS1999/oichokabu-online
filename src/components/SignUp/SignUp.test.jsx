import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import SignUp from './SignUp';
import Lobby from '../Lobby/Lobby';

const testRoutes = [
    { path: "/register", element: <SignUp /> },
    { path: "/lobby", element: <Lobby /> },
];

beforeEach(() => {
    renderWithProviders(null, {
        initialEntries: ["/register"],
        routes: testRoutes,
    })
})
afterEach(() => {
    cleanup()
})

describe('SignUp', () => {
    const registerDetails = { username: "test_user", email: "test@email.com", password: "test_password" }

    it('redirects to lobby when successful', async () => {
        await userEvent.type(getUserInput(), registerDetails.username);
        await userEvent.type(getEmailInput(), registerDetails.email);
        await userEvent.type(getPasswordInput(), registerDetails.password);
        await userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        await userEvent.click(getSubmitBtn());

        await screen.findByText("Create or join a game!");
    })

    it('prompts a toast when the username is too long', async () => {
        await userEvent.type(getUserInput(), "reallyreallylongusername");
        await userEvent.type(getEmailInput(), registerDetails.email);
        await userEvent.type(getPasswordInput(), registerDetails.password);
        await userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        await userEvent.click(getSubmitBtn());

        await screen.findByText("Usernames must be between 3 and 15 characters long");
    })

    it('prompts a toast when the username is too short', async () => {
        await userEvent.type(getUserInput(), "te");
        await userEvent.type(getEmailInput(), registerDetails.email);
        await userEvent.type(getPasswordInput(), registerDetails.password);
        await userEvent.type(getConfirmPasswordInput(), registerDetails.password);
        
        await userEvent.click(getSubmitBtn());

        await screen.findByText("Usernames must be between 3 and 15 characters long");
    })

    it('prompts a toast when the email is not in the correct format', async () => {
        await userEvent.type(getUserInput(), registerDetails.username);
        await userEvent.type(getEmailInput(), "test@example");
        await userEvent.type(getPasswordInput(), registerDetails.password);
        await userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        await userEvent.click(getSubmitBtn());

        await screen.findByText("E-mail address not formatted correctly");
    })

    it('prompts a toast when the password is too short', async () => {
        await userEvent.type(getUserInput(), registerDetails.username);
        await userEvent.type(getEmailInput(), registerDetails.email);
        await userEvent.type(getPasswordInput(), "pass");
        await userEvent.type(getConfirmPasswordInput(), "pass");

        await userEvent.click(getSubmitBtn());

        await screen.findByText("Passwords must be at least 8 characters long");
    })

    it('prompts a toast when password and confirmPassword do not match', async () => {
        await userEvent.type(getUserInput(), registerDetails.username);
        await userEvent.type(getEmailInput(), registerDetails.email);
        await userEvent.type(getPasswordInput(), registerDetails.password);
        await userEvent.type(getConfirmPasswordInput(), "pass_testword");

        await userEvent.click(getSubmitBtn());

        await screen.findByText("Password entries do not match");
    })
})

function getUserInput() {
    return screen.getByPlaceholderText("Username");
}

function getEmailInput() {
    return screen.getByPlaceholderText("E-Mail");
}

function getPasswordInput() {
    return screen.getByPlaceholderText("Password");
}

function getConfirmPasswordInput() {
    return screen.getByPlaceholderText("Confirm Password");
}

function getSubmitBtn() {
    return screen.getByRole('button', { name: /submit/i });
}