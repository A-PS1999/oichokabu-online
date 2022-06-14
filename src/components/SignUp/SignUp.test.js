import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import ToastPortal from '../../components/Toast/ToastPortal';
import Lobby from '../Lobby/Lobby';

beforeEach(() => {
    render(
        <Provider store={store}>
            <ToastPortal />
            <MemoryRouter initialEntries={["/register"]}>
                <Routes>
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/lobby" element={<Lobby />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )
})
afterEach(() => {
    cleanup()
})

describe('SignUp', () => {
    const registerDetails = { username: "test_user", email: "test@email.com", password: "test_password" }

    it('redirects to lobby when successful', async () => {
        userEvent.type(getUserInput(), registerDetails.username);
        userEvent.type(getEmailInput(), registerDetails.email);
        userEvent.type(getPasswordInput(), registerDetails.password);
        userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        userEvent.click(getSubmitBtn());

        await screen.findByText("Create or join a game!");
    })

    it('prompts a toast when the username is too long', async () => {
        userEvent.type(getUserInput(), "reallyreallylongusername");
        userEvent.type(getEmailInput(), registerDetails.email);
        userEvent.type(getPasswordInput(), registerDetails.password);
        userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        userEvent.click(getSubmitBtn());

        await screen.findByText("Usernames must be between 3 and 15 characters long");
    })

    it('prompts a toast when the username is too short', async () => {
        userEvent.type(getUserInput(), "te");
        userEvent.type(getEmailInput(), registerDetails.email);
        userEvent.type(getPasswordInput(), registerDetails.password);
        userEvent.type(getConfirmPasswordInput(), registerDetails.password);
        
        userEvent.click(getSubmitBtn());

        await screen.findByText("Usernames must be between 3 and 15 characters long");
    })

    it('prompts a toast when the email is not in the correct format', async () => {
        userEvent.type(getUserInput(), registerDetails.username);
        userEvent.type(getEmailInput(), "www.wrongformat.com");
        userEvent.type(getPasswordInput(), registerDetails.password);
        userEvent.type(getConfirmPasswordInput(), registerDetails.password);

        userEvent.click(getSubmitBtn());

        await screen.findByText("E-mail address not formatted correctly");
    })

    it('prompts a toast when the password is too short', async () => {
        userEvent.type(getUserInput(), registerDetails.username);
        userEvent.type(getEmailInput(), registerDetails.email);
        userEvent.type(getPasswordInput(), "pass");
        userEvent.type(getConfirmPasswordInput(), "pass");

        userEvent.click(getSubmitBtn());

        await screen.findByText("Passwords must be at least 8 characters long");
    })

    it('prompts a toast when password and confirmPassword do not match', async () => {
        userEvent.type(getUserInput(), registerDetails.username);
        userEvent.type(getEmailInput(), registerDetails.email);
        userEvent.type(getPasswordInput(), registerDetails.password);
        userEvent.type(getConfirmPasswordInput(), "pass_testword");

        userEvent.click(getSubmitBtn());

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