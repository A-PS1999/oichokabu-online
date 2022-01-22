import React, { useEffect } from 'react';
import './Lobby.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { modalActions } from '../../store/modalSlice.js';
import { socket } from '../../services/socket.js';
import Navbar from '../Navbar/Navbar.js';
import Modal from '../Modal/Modal.js';
import CreateGameForm from './CreateGameForm/CreateGameForm.js';

export default function Lobby() {
	
	const dispatch = useDispatch();
	const { isError, errorMessage, rooms } = useSelector(lobbySelector);

	useEffect(() => {
		socket.on('connect', () => {
			console.log(socket.id);
			console.log(socket);
		});
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
					<section className="lobby-body">
					{rooms.length > 0 ? rooms.map((room) => {
						return(
							<React.Fragment key={room.game_id}>
								<div className="lobby-body__room">
									<h3 className="lobby-body__room__room-name">{room.room_name}</h3>
									{room.status === 'open' &&
										<div className="lobby-body__room__room-status--open">{room.status.toUpperCase()}</div>
									}
									{room.status === 'started' || room.status === 'running' ? 
										<div className="lobby-body__room__room-status--ongoing">{room.status.toUpperCase()}</div>
										: null
									}
									{room.status === 'ended' &&
										<div className="lobby-body__room__room-status--ended">{room.status.toUpperCase()}</div>
									}
									<div className="lobby-body__room__player-text">Players: {room.player_cap}</div>
									<button className="lobby-body__room__button">Join Game</button>
								</div>
							</React.Fragment>
						)
					})
					: <>
						<div>
							<h2 className="lobby-body__noroom-text">Looks like there aren't any rooms.</h2>
						</div>
					</>
					}
					</section>
				</main>
			</div>
		</>
	)
};