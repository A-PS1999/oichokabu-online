import React, { useEffect } from 'react';
import './Lobby.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames, fetchUserId } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { modalActions } from '../../store/modalSlice.js';
import Navbar from '../Navbar/Navbar.js';
import Modal from '../Modal/Modal.js';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/es/locale/en_US';
import 'rc-pagination/assets/index.css';
import usePagination from '../../utils/usePagination';
import CreateGameForm from './CreateGameForm/CreateGameForm.js';
import { PregameAPI, socket } from '../../services';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
	
	const dispatch = useDispatch();
	let navigate = useNavigate();
	const { isError, errorMessage, rooms, userId } = useSelector(lobbySelector);
	let { pageData, page, jumpPage } = usePagination(rooms, 10);

	useEffect(() => {
		dispatch(fetchUserId())
	}, [dispatch])

	useEffect(() => {
		dispatch(fetchGames());
		socket.on('lobby:create-game', (data) => {
			const gameId = parseInt(data.gameId, 10);
			dispatch(fetchGames());

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, { state: { 
					game_id: gameId,
					user_id: userId
				}});
			}
		});
		socket.on('lobby:join-game', (data) => {
			const gameId = parseInt(data.gameId, 10);

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, { state: {
					game_id: gameId,
					user_id: userId
				}});
			}
		})

		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
			navigate("/log-in");
		}
	}, [dispatch, errorMessage, isError, navigate, userId])

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
					{rooms.length > 0 ? pageData().map((room) => {
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
									<div className="lobby-body__room__player-text">Players: {room.Players.length}/{room.player_cap}</div>
									<div className="lobby-body__room__turn-text">Max Rounds: {room.turn_max}</div>
									<div className="lobby-body__room__bet-text">Max Bet: {room.bet_max}</div>
									<button className="lobby-body__room__button" onClick={() => PregameAPI.postJoinGame(room.game_id)} disabled={room.Players.length === room.player_cap}>
										Join Game
									</button>
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
					{rooms.length > 1 ?
						<Pagination 
							current={page}
							locale={locale}
							total={rooms.length}
							pageSize={10}
							onChange={(page) => jumpPage(page)}
						/>
						: null
					}
					</section>
				</main>
			</div>
		</>
	)
};