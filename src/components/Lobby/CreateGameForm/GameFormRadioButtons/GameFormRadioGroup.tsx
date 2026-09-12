import type { ChangeEvent } from 'react';

export type GameFormRadioGroupProps = {
	currValue: string | number;
	onChange: (value: number) => void;
};

export default function GameFormRadioGroup({ currValue, onChange }: GameFormRadioGroupProps) {
	const buttonVals = ['2', '3', '4', '5'];

	return (
		<div className="game-form__radio-group">
			<fieldset>
				<legend>Select the player cap</legend>
				{buttonVals.map((val, idx) => {
					return (
						<label
							key={idx}
							className="game-form__radio-group-label game-form__radio-subgroup"
						>
							<input
								type="radio"
								name="playerCap"
								value={val}
								checked={String(currValue) === val}
								className="game-form__radio-subgroup-input"
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									onChange(parseInt(e.target.value));
								}}
							/>
							{val}
						</label>
					);
				})}
			</fieldset>
		</div>
	);
}
