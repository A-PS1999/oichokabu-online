import React from "react";

export default function GameFormRadioGroup({ currValue, onChange }) {

	const buttonVals = ["2", "3", "4", "5"];

	return (
		<div className="game-form__radio-group">
			<fieldset>
				<legend>Select the player cap</legend>
				{buttonVals.map((val, idx) => {
					return (
						<label key={idx} className='game-form__radio-group-label game-form__radio-subgroup'>
							<input
								type="radio"
								name="playerCap"
								value={val}
								checked={currValue == val}
								className="game-form__radio-subgroup-input"
								onChange={e => {
									onChange(parseInt(e.target.value))
								}}
							/>
							{val}
						</label>
					)
				})}
			</fieldset>
		</div>
	)
}