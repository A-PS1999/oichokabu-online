import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import FrontPage from './FrontPage';
import RulesPage from '../RulesPage/RulesPage';

const routes = [
    { path: "/", element: <FrontPage /> },
    { path: "/register", element: <div>Sign up page</div> },
    { path: "/rules", element: <RulesPage /> },
];

describe('FrontPage', () => {
    it('renders the page heading and about section', () => {
        renderWithProviders(<FrontPage />, { routes });
        expect(screen.getByRole('heading', { level: 1, name: /oicho kabu online/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /what is oicho kabu/i })).toBeInTheDocument();
    });

    it('navigates to the register page via the header link', async () => {
        renderWithProviders(<FrontPage />, { routes });
        await userEvent.click(screen.getByRole('link', { name: /sign up now/i }));
        expect(screen.getByText("Sign up page")).toBeInTheDocument();
    });

    it('navigates to the rules page via the learn the rules link', async () => {
        renderWithProviders(<FrontPage />, { routes });
        await userEvent.click(screen.getByRole('link', { name: /learn the rules/i }));
        expect(screen.getByRole('heading', { level: 1, name: /how to play oicho kabu/i })).toBeInTheDocument();
    });
});