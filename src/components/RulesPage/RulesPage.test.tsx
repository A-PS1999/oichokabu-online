import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import RulesPage from './RulesPage';

describe('RulesPage', () => {
    it('renders the page heading and contents links', () => {
        renderWithProviders(<RulesPage />);
        expect(screen.getByRole('heading', { level: 1, name: /how to play oicho kabu/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /game objective/i })).toBeInTheDocument();
    });

    it('scrolls to the top when the back to top button is clicked', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        renderWithProviders(<RulesPage />);

        await userEvent.click(screen.getByRole('button', { name: /back to top/i }));

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
});