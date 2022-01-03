import React from "react";

export default function GameFormRadioGroup({ onChange }) {

    return (
        <div className="game-form__radio-group">
			<label className='game-form__radio-group-label game-form__radio-subgroup'>
				<input 
					type="radio"
					name="playerCap"
					value="2"
					className="game-form__radio-subgroup-input"
                    onChange={e => {
						onChange(parseInt(e.target.value))
					}}
				/>
				2
			</label>
			<label className='game-form__radio-group-label game-form__radio-subgroup'>
				<input 
					type="radio"
					name="playerCap"
					value="3"
					className="game-form__radio-subgroup-input"
                    onChange={e => {
						onChange(parseInt(e.target.value))
					}}
				/>
				3
			</label>
			<label className='game-form__radio-group-label game-form__radio-subgroup'>
				<input 
					type="radio"
					name="playerCap"
					value="4"
					className="game-form__radio-subgroup-input"
                    onChange={e => {
						onChange(parseInt(e.target.value))
					}}
				/>
				4
			</label>
			<label className='game-form__radio-group-label game-form__radio-subgroup'>
				<input 
					type="radio"
					name="playerCap"
					value="5"
					className="game-form__radio-subgroup-input"
                    onChange={e => {
						onChange(parseInt(e.target.value))
					}}
				/>
				5
			</label>
		</div>
    )
}