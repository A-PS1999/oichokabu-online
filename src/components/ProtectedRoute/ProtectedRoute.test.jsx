import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import ProtectedRoute from './ProtectedRoute';

const routes = [
    {
        path: "/protected",
        element: (
            <ProtectedRoute>
                <div>Secret content</div>
            </ProtectedRoute>
        ),
    },
    { path: "/log-in", element: <div>Login page</div> },
];

const baseUser = {
    username: "",
    email: "",
    isFetching: false,
    isSuccessful: false,
    isError: false,
    errorMessage: "",
};

describe('ProtectedRoute', () => {
    it('redirects to /log-in when unauthenticated', () => {
        renderWithProviders(null, {
            initialEntries: ["/protected"],
            routes,
            preloadedState: { user: { ...baseUser, sessionStatus: "unauthenticated" } },
        });

        expect(screen.getByText("Login page")).toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        renderWithProviders(null, {
            initialEntries: ["/protected"],
            routes,
            preloadedState: { user: { ...baseUser, sessionStatus: "authenticated" } },
        });

        expect(screen.getByText("Secret content")).toBeInTheDocument();
    });

    it('renders a Loader while checking', () => {
        renderWithProviders(null, {
            initialEntries: ["/protected"],
            routes,
            preloadedState: { user: { ...baseUser, sessionStatus: "checking" } },
        });

        expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
