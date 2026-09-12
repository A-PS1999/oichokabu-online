import { renderWithProviders } from '../../test-utils';
import Loader from './Loader';

describe('Loader', () => {
    it('renders the loading spinner div', () => {
        renderWithProviders(<Loader />);
        expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
    });
});