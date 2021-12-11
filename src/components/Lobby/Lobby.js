import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { modalActions } from '../../store/modalSlice.js';
import Navbar from '../Navbar/Navbar.js';
import Modal from '../Modal/Modal.js';
import CreateGameForm from './CreateGameForm/CreateGameForm.js';

export default function Lobby() {
	
	const dispatch = useDispatch();
	const { isError, errorMessage, rooms } = useSelector(lobbySelector);
	
	useEffect(() => {
		dispatch(fetchGames());
		
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
		}
	}, [dispatch, errorMessage, isError])
	
	return (
		<>
			<Navbar />
			<Modal>
				<CreateGameForm />
			</Modal>
			<div>
				<main>
					<div className="lobby-heading">
						<h2>Lobby</h2>
						<h3>Create or join a game!</h3>
					</div>
					<div>
						<button onClick={async () => {dispatch(modalActions.toggleModal)}}>
							Create Game
						</button>
					</div>
					<div>
					{rooms.length > 0 ? rooms.map((room, index) => {
						return(
							<React.Fragment key={room.game_id}>
								<div>
									<h3>{room.room_name}</h3>
								</div>
							</React.Fragment>
						)
					})
					: <>
						<div>
							<h2>Looks like there aren't any rooms.</h2>
						</div>
					</>
					}
					</div>
				</main>
			</div>
		</>
	)
};