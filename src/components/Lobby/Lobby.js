import React, { useEffect } from 'react';
import './Lobby.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { modalActions } from '../../store/modalSlice.js';
import { PregameAPI } from '../../services/api-functions.js';
import Navbar from '../Navbar/Navbar.js';
import Modal from '../Modal/Modal.js';
import CreateGameForm from './CreateGameForm/CreateGameForm.js';

async function getRoomPlayers(roomId) {
	const { data: pregameInfo } = await PregameAPI.getPlayerInfo(roomId);
	let playerCount = pregameInfo.Players.length;

	return playerCount;
}

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
					<section className="lobby-head">
						<div className="lobby-head__text">
							<h1 className="lobby-head__text__title">Lobby</h1>
							<h2>Create or join a game!</h2>
						</div>
						<div className="lobby-head__button-container">
							<button className="lobby-head__button" onClick={async () => { await dispatch(modalActions.toggleModal()) }}>
								Create Game
							</button>
						</div>
					</section>
					<div>
					{rooms.length > 0 ? rooms.map((room, index) => {
						return(
							<React.Fragment key={room.game_id}>
								<div>
									<h3>{room.room_name}</h3>
									<div>{room.status.toUpperCase()}</div>
									<div>Players: {room.player_cap}</div>
									<button>Join Game</button>
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