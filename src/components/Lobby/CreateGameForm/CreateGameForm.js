import React, { useEffect } from 'react';
import './CreateGameForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, createNewGame } from '../../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../../store/lobbySlice.js';
import { toastActions } from '../../../store/toastSlice.js';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { GameFormRadioGroup } from '../GameFormRadioButtons/GameFormRadioGroup';
import Slider from 'react-input-slider';

function SliderWatched({ control }) {
	const sliderValue = useWatch({
		control,
		name: "turnMax",
		defaultValue: 12
	});

	return <div className='game-form__slider-heading'>Max turns: {sliderValue}</div>
}

export default function CreateGameForm() {
	
	const { register, handleSubmit, control } = useForm();
	const dispatch = useDispatch();
	const { isSuccessful, isError, errorMessage } = useSelector(lobbySelector);
	
	const submitData = (data) => {
		dispatch(createNewGame(data))
	};
	
	useEffect(() => {
		if (isSuccessful) {
			dispatch(clearState())
			console.log("New game room created")
		}
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [dispatch, isSuccessful, isError, errorMessage])
	
	return (
		<>
			<div className='game-form'>
				<h2 className="game-form__heading">Create a new game</h2>
				<form onSubmit={handleSubmit(submitData)}>
					<input {...register("roomName", { required: true })} placeholder="Room Name" className="game-form__room-name"/>
					<h3 className='game-form__heading'>Player Cap</h3>
					<div className="game-form__radio-group">
						<label className='game-form__radio-group-label game-form__radio-subgroup'>
							<input 
								{...register("playerCap")}
								type="radio"
								name="playerCap"
								value="2"
								className="game-form__radio-subgroup-input"
							/>
							2
						</label>
						<label className='game-form__radio-group-label game-form__radio-subgroup'>
							<input 
								{...register("playerCap")}
								type="radio"
								name="playerCap"
								value="3"
								className="game-form__radio-subgroup-input"
							/>
							3
						</label>
						<label className='game-form__radio-group-label game-form__radio-subgroup'>
							<input 
								{...register("playerCap")}
								type="radio"
								name="playerCap"
								value="4"
								className="game-form__radio-subgroup-input"
							/>
							4
						</label>
						<label className='game-form__radio-group-label game-form__radio-subgroup'>
							<input 
								{...register("playerCap")}
								type="radio"
								name="playerCap"
								value="5"
								className="game-form__radio-subgroup-input"
							/>
							5
						</label>
					</div>
					<h3 className='game-form__heading'>Game Turns</h3>
					<SliderWatched control={control} />
					<Controller
						control={control}
						name="turnMax"
						defaultValue={12}
						render={({ field: { value, onChange } }) => (
							<Slider
								axis={"x"}
								xmax={24}
								xmin={6}
								xstep={1}
								onChange={({ x }) => onChange(x)}
								x={value}
								styles={{
									active: {
										backgroundColor: '#BC002D'
									},
									track: {
										marginBottom: '1.3rem',
										width: '292px'
									}
								}}
							/>
						)}
					/>
					<button type="submit" className='game-form__button'>Create Game</button>
				</form>
			</div>
		</>
	)
};