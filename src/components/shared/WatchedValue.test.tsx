import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, Controller } from 'react-hook-form';
import { renderWithProviders } from '../../test-utils';
import WatchedValue from './WatchedValue';

function WatchedValueHarness() {
    const { control } = useForm();

    return (
        <>
            <WatchedValue
                control={control}
                name="turnMax"
                defaultVal={12}
                formTitle="game"
                description="Max turns:"
            />
            <Controller
                control={control}
                name="turnMax"
                defaultValue={12}
                render={({ field: { value, onChange } }) => (
                    <button onClick={() => onChange(value + 1)}>
                        Increase
                    </button>
                )}
            />
        </>
    );
}

describe('WatchedValue', () => {
    it('renders the description with the default value', () => {
        renderWithProviders(<WatchedValueHarness />);
        expect(screen.getByText(/Max turns: 12/)).toBeInTheDocument();
    });

    it('updates the displayed value when the watched field changes', async () => {
        renderWithProviders(<WatchedValueHarness />);
        await userEvent.click(screen.getByRole('button', { name: /increase/i }));
        expect(screen.getByText(/Max turns: 13/)).toBeInTheDocument();
    });
});