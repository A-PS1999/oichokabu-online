import React, { useEffect } from 'react';
import './CreateGameForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, createNewGame } from '../../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../../store/lobbySlice.js';
import { createToast } from '../../../store/toastSlice.js';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../../Modal/Modal.jsx';
import GameFormRadioGroup from './GameFormRadioButtons/GameFormRadioGroup';
import Slider from 'react-input-slider';
import { sliderStyles } from '../../shared/sliderStyles.js';
import WatchedValue from '../../shared/WatchedValue.jsx';

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
		}
		if (isError) {
			dispatch(createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [dispatch, isSuccessful, isError, errorMessage])

	return (
		<>
			<Modal aria-label="Create a new game" aria-labelledby="creategame-heading">
				<div className='game-form'>
					<h2 id="creategame-heading" className="game-form__heading">
						Create a new game
					</h2>
					<form onSubmit={handleSubmit(submitData)}>
						<input autoFocus={true} {...register("roomName", {
							required: true,
							minLength: 3,
							maxLength: 15,
						})}
							placeholder="Room Name"
							className="game-form__room-name"
						/>
						<h3 className='game-form__heading'>Player Cap</h3>
						<Controller
							control={control}
							name="playerCap"
							defaultValue={"2"}
							render={({ field: { onChange, value } }) => (
								<GameFormRadioGroup
									currValue={value}
									onChange={onChange}
								/>
							)}
						/>
						<h3 className='game-form__heading'>Game Turns</h3>
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
								<Slider
									axis={"x"}
									xmax={24}
									xmin={6}
									xstep={1}
									onChange={({ x }) => onChange(x)}
									x={value}
									styles={sliderStyles}
								/>
							)}
						/>
						<h3 className='game-form__heading'>Max bet per round</h3>
						<WatchedValue
							control={control}
							name="betMax"
							defaultVal={500}
							formTitle="game"
							description="Max bet:"
						/>
						<Controller
							control={control}
							name="betMax"
							defaultValue={500}
							render={({ field: { value, onChange } }) => (
								<Slider
									axis={"x"}
									xmax={10000}
									xmin={500}
									xstep={100}
									onChange={({ x }) => onChange(x)}
									x={value}
									styles={sliderStyles}
								/>
							)}
						/>
						<button type="submit" className='game-form__button'>Create Game</button>
					</form>
				</div>
			</Modal>
		</>
	)
};