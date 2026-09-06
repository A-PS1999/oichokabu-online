import { screen } from '@testing-library/react';
import { act } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { renderWithProviders } from '../../test-utils';
import { createToast } from '../../store/toastSlice';

function ToastTrigger({ message }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(createToast({ message, type: "success" }));
    }, [dispatch, message]);

    return null;
}

describe('Toast', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('dispatches createToast and renders the message', () => {
        renderWithProviders(<ToastTrigger message="Hello world" />);
        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it('auto-dismisses the toast after the middleware delay', async () => {
        vi.useFakeTimers();
        renderWithProviders(<ToastTrigger message="Goodbye" />);
        expect(screen.getByText("Goodbye")).toBeInTheDocument();

        await act(async () => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
    });
});
