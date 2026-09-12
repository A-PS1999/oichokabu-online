import { useEffect } from 'react';
import './Lobby.scss';
import { useSelector } from 'react-redux';
import {
	lobbySelector,
	fetchGames,
	fetchUserIdAndChips,
	joinGame,
	resetUserChips,
	lobbyStateReset as clearState,
} from '../../store/lobbySlice';
import { createToast } from '../../store/toastSlice';
import { modalActions } from '../../store/modalSlice';
import Navbar from '../Navbar/Navbar';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/es/locale/en_US';
import 'rc-pagination/assets/index.css';
import usePagination from '../../hooks/usePagination';
import CreateGameForm from './CreateGameForm/CreateGameForm';
import { useNavigate } from 'react-router';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch } from '../../store/hooks';
import type { LobbyCreateGamePayload, LobbyMembershipPayload } from '@shared/socket-events';

export default function Lobby() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const socket = useSocket();
	const { isError, errorMessage, rooms, userId, chips } = useSelector(lobbySelector);
	const { pageData, page, jumpPage } = usePagination(rooms, 10);

	const resetChips = (chipsToReset: number) => {
		dispatch(resetUserChips(chipsToReset));
	};

	useEffect(() => {
		dispatch(fetchUserIdAndChips());
		dispatch(fetchGames());
	}, [dispatch]);

	useEffect(() => {
		const createGameSocketHandler = (data: LobbyCreateGamePayload) => {
			const gameId = data.gameId;
			dispatch(fetchGames());

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, {
					state: {
						user_id: userId,
					},
				});
				dispatch(modalActions.toggleModal());
			}
		};
		socket.on('lobby:create-game', createGameSocketHandler);
		const joinGameSocketHandler = (data: LobbyMembershipPayload) => {
			const gameId = data.gameId;
			dispatch(fetchGames());

			if (userId === data.userId) {
				navigate(`/pregame-lobby/${gameId}`, {
					state: {
						user_id: userId,
					},
				});
			}
		};
		socket.on('lobby:join-game', joinGameSocketHandler);

		return () => {
			socket.off('lobby:create-game', createGameSocketHandler);
			socket.off('lobby:join-game', joinGameSocketHandler);
		};
	}, [dispatch, navigate, userId, socket]);

	useEffect(() => {
		if (isError) {
			dispatch(
				createToast({
					message: errorMessage,
					type: 'error',
				}),
			);
			dispatch(clearState());
		}
	}, [dispatch, isError, errorMessage]);

	return (
		<>
			<Navbar />
			<CreateGameForm />
			<div>
				<main>
					<section className="lobby-head">
						<div className="lobby-head__chips-display">Your Chips: {chips}</div>
						<div className="lobby-head__button-container--left">
							<button
								className="lobby-head__button"
								disabled={chips > 100}
								onClick={() => resetChips(chips)}
							>
								Reset Chips
							</button>
						</div>
						<div className="lobby-head__text">
							<h1 className="lobby-head__text__title">Lobby</h1>
							<h2>Create or join a game!</h2>
						</div>
						<div className="lobby-head__button-container">
							<button
								className="lobby-head__button"
								disabled={chips < 100}
								onClick={() => {
									dispatch(modalActions.toggleModal());
								}}
							>
								Create Game
							</button>
						</div>
					</section>
					<section className="lobby-body">
						{rooms.length > 0 ? (
							pageData().map((room) => {
								return (
									<div key={room.game_id} className="lobby-body__room">
										<h3 className="lobby-body__room__room-name">{room.room_name}</h3>
										{room.status === 'open' && (
											<div className="lobby-body__room__room-status--open">
												{room.status.toUpperCase()}
											</div>
										)}
										{room.status === 'started' || room.status === 'running' ? (
											<div className="lobby-body__room__room-status--ongoing">
												{room.status.toUpperCase()}
											</div>
										) : null}
										{room.status === 'ended' && (
											<div className="lobby-body__room__room-status--ended">
												{room.status.toUpperCase()}
											</div>
										)}
										<div className="lobby-body__room__player-text">
											Players: {room.Players.length}/{room.player_cap}
										</div>
										<div className="lobby-body__room__turn-text">
											Max Rounds: {room.turn_max}
										</div>
										<div className="lobby-body__room__bet-text">Max Bet: {room.bet_max}</div>
										<button
											className="lobby-body__room__button"
											onClick={() => dispatch(joinGame(room.game_id))}
											disabled={room.Players.length === room.player_cap || chips < 100}
										>
											Join Game
										</button>
									</div>
								);
							})
						) : (
							<>
								<div>
									<h2 className="lobby-body__noroom-text">
										Looks like there aren't any rooms.
									</h2>
								</div>
							</>
						)}
						{rooms.length > 1 ? (
							<Pagination
								current={page}
								locale={locale}
								total={rooms.length}
								pageSize={10}
								onChange={(pageNumber) => jumpPage(pageNumber)}
							/>
						) : null}
					</section>
				</main>
			</div>
		</>
	);
}
