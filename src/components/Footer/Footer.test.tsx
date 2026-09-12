import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Footer from './Footer';

describe('Footer', () => {
    it('renders the developer credit', () => {
        renderWithProviders(<Footer />);
        expect(screen.getByText("Developed by Samuel Arnold-Parra")).toBeInTheDocument();
    });

    it('renders LinkedIn and GitHub links', () => {
        renderWithProviders(<Footer />);
        const linkedin = screen.getByRole('link', { name: /linkedin/i });
        const github = screen.getByRole('link', { name: /github/i });

        expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/samuel-arnold-parra-2899721b6/');
        expect(github).toHaveAttribute('href', 'https://github.com/A-PS1999/oichokabu-online');
    });
});