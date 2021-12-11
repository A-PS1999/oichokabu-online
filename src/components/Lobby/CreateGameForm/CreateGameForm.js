import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, createNewGame } from '../../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../../store/lobbySlice.js';
import { toastActions } from '../../../store/toastSlice.js';
import { useForm, Controller } from 'react-hook-form';
import Slider from 'react-input-slider';

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
			<div>
				<form onSubmit={handleSubmit(submitData)}>
					<input {...register("roomName", { required: true })} placeholder="Room Name" />
					<div>
						<input 
							{...register("playerCap")}
							type="radio"
							name="player-cap"
							value="2"
						/>
						<input 
							{...register("playerCap")}
							type="radio"
							name="player-cap"
							value="3"
						/>
						<input 
							{...register("playerCap")}
							type="radio"
							name="player-cap"
							value="4"
						/>
						<input 
							{...register("playerCap")}
							type="radio"
							name="player-cap"
							value="5"
						/>
					</div>
					<Controller
						control={control}
						name="turn-max"
						defaultValue={12}
						render={({ field: { value, onChange } }) => (
							<Slider
								axis={"x"}
								xmax={24}
								xmin={6}
								xstep={1}
								onChange={({ x }) => onChange(x)}
								x={value}
							/>
						)}
					/>
					<button type="submit">Create Game</button>
				</form>
			</div>
		</>
	)
};