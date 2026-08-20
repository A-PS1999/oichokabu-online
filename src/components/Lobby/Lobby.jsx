import React, { useEffect } from 'react';
import './Lobby.scss';
import { useSelector, useDispatch } from 'react-redux';
import { lobbySelector, fetchGames, fetchUserIdAndChips } from '../../store/lobbySlice.js';
import { lobbyStateReset as clearState } from '../../store/lobbySlice.js';
import { toastActions } from '../../store/toastSlice.js';
import { modalActions } from '../../store/modalSlice.js';
import Navbar from '../Navbar/Navbar.jsx';
import Modal from '../Modal/Modal.jsx';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/es/locale/en_US';
import 'rc-pagination/assets/index.css';
import usePagination from '../../utils/usePagination';
import CreateGameForm from './CreateGameForm/CreateGameForm.jsx';
import { PregameAPI, LobbyAPI } from '../../services';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const socket = useSocket();
	const { isError, errorMessage, rooms, userId, chips } = useSelector(lobbySelector);
	const { pageData, page, jumpPage } = usePagination(rooms, 10);

	const resetChips = async (chips) => {
		await LobbyAPI.resetUserChips(chips);
		dispatch(fetchUserIdAndChips());
	};

	useEffect(() => {
		dispatch(fetchUserIdAndChips());
		dispatch(fetchGames());
	}, [dispatch])

	useEffect(() => {
		const createGameSocketHandler = (data) => {
			const gameId = parseInt(data.gameId, 10);
			dispatch(fetchGames());

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, { state: { 
					game_id: gameId,
					user_id: userId
				}});
				dispatch(modalActions.toggleModal());
			}
		}
		socket.on('lobby:create-game', createGameSocketHandler);
		const joinGameSocketHandler = (data) => {
			const gameId = parseInt(data.gameId, 10);
			dispatch(fetchGames());

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, { state: {
					game_id: gameId,
					user_id: userId
				}});
			}
		}
		socket.on('lobby:join-game', joinGameSocketHandler);

		return () => {
			socket.off('lobby:create-game', createGameSocketHandler);
			socket.off('lobby:join-game', joinGameSocketHandler);
		}
	}, [dispatch, navigate, userId])

	useEffect(() => {
		if (isError) {
			dispatch(toastActions.createToast({
				message: errorMessage,
				type: "error",
			}));
			dispatch(clearState());
			navigate("/log-in");
		}
	}, [dispatch, isError, errorMessage])

	return (
		<>
			<Navbar />
			<Modal>
				<CreateGameForm />
			</Modal>
			<div>
				<main>
					<section className="lobby-head">
						<div className='lobby-head__chips-display'>
							Your Chips: {chips}
						</div>
						<div className="lobby-head__button-container--left">
							<button className="lobby-head__button" disabled={chips > 100} onClick={() => resetChips(chips)}>
								Reset Chips
							</button>
						</div>
						<div className="lobby-head__text">
							<h1 className="lobby-head__text__title">Lobby</h1>
							<h2>Create or join a game!</h2>
						</div>
						<div className="lobby-head__button-container">
							<button className="lobby-head__button" disabled={chips < 100} onClick={async () => { await dispatch(modalActions.toggleModal()) }}>
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
									<button className="lobby-body__room__button" onClick={() => PregameAPI.postJoinGame(room.game_id)} disabled={room.Players.length === room.player_cap || chips < 100}>
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