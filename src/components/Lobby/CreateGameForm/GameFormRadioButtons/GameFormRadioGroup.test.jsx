import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { renderWithProviders } from '../../../../test-utils';
import GameFormRadioGroup from './GameFormRadioGroup';

function RadioHarness({ onChangeSpy }) {
    const [currValue, setCurrValue] = useState("2");

    return (
        <GameFormRadioGroup
            currValue={currValue}
            onChange={(val) => {
                setCurrValue(String(val));
                onChangeSpy(val);
            }}
        />
    );
}

describe('GameFormRadioGroup', () => {
    it('renders a radio option for each player cap', () => {
        renderWithProviders(<GameFormRadioGroup currValue="2" onChange={() => {}} />);

        ["2", "3", "4", "5"].forEach((val) => {
            expect(screen.getByRole('radio', { name: val })).toBeInTheDocument();
        });
    });

    it('checks the radio matching currValue', () => {
        renderWithProviders(<GameFormRadioGroup currValue="3" onChange={() => {}} />);

        expect(screen.getByRole('radio', { name: "3" })).toBeChecked();
        expect(screen.getByRole('radio', { name: "2" })).not.toBeChecked();
    });

    it('calls onChange with the parsed integer value on selection', async () => {
        const onChangeSpy = vi.fn();
        renderWithProviders(<RadioHarness onChangeSpy={onChangeSpy} />);

        await userEvent.click(screen.getByRole('radio', { name: "5" }));

        expect(onChangeSpy).toHaveBeenCalledWith(5);
        expect(screen.getByRole('radio', { name: "5" })).toBeChecked();
    });
});