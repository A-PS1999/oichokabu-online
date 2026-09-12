import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import NotFound from './NotFound';

const routes = [
    { path: "/", element: <div>Home page</div> },
    { path: "/404", element: <NotFound /> },
];

describe('NotFound', () => {
    it('renders the 404 message', () => {
        renderWithProviders(<NotFound />, {
            initialEntries: ["/404"],
            routes,
        });
        expect(screen.getByRole('heading', { level: 1, name: /doesn't exist/i })).toBeInTheDocument();
    });

    it('returns to the home page via the link', async () => {
        renderWithProviders(<NotFound />, {
            initialEntries: ["/404"],
            routes,
        });
        await userEvent.click(screen.getByRole('link', { name: /return to home page/i }));
        expect(screen.getByText("Home page")).toBeInTheDocument();
    });

    it('renders a previous page button', () => {
        renderWithProviders(<NotFound />, {
            initialEntries: ["/404"],
            routes,
        });
        expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    });
});