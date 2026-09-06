import { screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { renderWithProviders } from '../../test-utils';
import { modalActions } from '../../store/modalSlice';
import Modal from './Modal';

function ModalHarness() {
    const dispatch = useDispatch();

    return (
        <>
            <button onClick={() => dispatch(modalActions.toggleModal())}>
                Open modal
            </button>
            <Modal aria-label="Test modal">
                <p>Modal body</p>
                <button>Inside button</button>
            </Modal>
        </>
    );
}

describe('Modal', () => {
    it('is closed by default and opens via toggleModal', () => {
        renderWithProviders(<ModalHarness />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes when the Escape key is pressed', () => {
        renderWithProviders(<ModalHarness />);
        fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes when the backdrop is clicked', () => {
        renderWithProviders(<ModalHarness />);
        fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

        fireEvent.mouseDown(document.querySelector('.modal--backdrop'));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('focuses the first focusable element on open', () => {
        renderWithProviders(<ModalHarness />);
        fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

        const closeButton = screen.getByRole('button', { name: /close modal/i });
        expect(document.activeElement).toBe(closeButton);
    });
});
