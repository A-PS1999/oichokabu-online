import { useEffect } from 'react';
import './PregameLobby.scss';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
	pregameSelector,
	fetchPlayerInfo,
	fetchPlayerStatuses,
	handleStartGame,
	toggleReady,
	leaveGame,
	pregameStateReset,
} from '../../store/pregameSlice';
import { createToast } from '../../store/toastSlice';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch } from '../../store/hooks';
import type { PregameLeaveGamePayload } from '@shared/socket-events';

export default function PregameLobby() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams<{ gameId: string }>();
	const socket = useSocket();
	const { playerInfo, playerStatuses, isError, errorMessage } = useSelector(pregameSelector);

	const gameId = params.gameId ?? '';

	useEffect(() => {
		socket.emit('pregame:rejoin', { gameId }, (res: { ok: boolean }) => {
			if (res && !res.ok) {
				dispatch(
					createToast({
						message: 'Failed to join lobby',
						type: 'error',
					}),
				);
			}
		});
		dispatch(fetchPlayerStatuses(gameId));
		dispatch(fetchPlayerInfo(gameId));

		const pregameSocketHandler = () => {
			dispatch(fetchPlayerStatuses(gameId));
		};
		socket.on(`pregame-lobby:${gameId}:enter-game`, pregameSocketHandler);
		socket.on(`pregame-lobby:${gameId}:player-ready`, pregameSocketHandler);
		socket.on(`pregame-lobby:${gameId}:player-unready`, pregameSocketHandler);

		return () => {
			socket.off(`pregame-lobby:${gameId}:enter-game`, pregameSocketHandler);
			socket.off(`pregame-lobby:${gameId}:player-ready`, pregameSocketHandler);
			socket.off(`pregame-lobby:${gameId}:player-unready`, pregameSocketHandler);
			dispatch(pregameStateReset());
		};
	}, [dispatch, gameId, socket]);

	useEffect(() => {
		if (isError) {
			dispatch(
				createToast({
					message: errorMessage,
					type: 'error',
				}),
			);
		}
	}, [dispatch, isError, errorMessage]);

	useEffect(() => {
		const leaveGameSocketHandler = (data: PregameLeaveGamePayload) => {
			dispatch(fetchPlayerStatuses(gameId));
			if (location.state?.user_id === data.userId) {
				navigate('/lobby');
			}
			if (data.hostStatus === true) {
				navigate('/lobby');
			}
		};
		socket.on(`pregame-lobby:${gameId}:leave-game`, leaveGameSocketHandler);
		return () => {
			socket.off(`pregame-lobby:${gameId}:leave-game`, leaveGameSocketHandler);
		};
	}, [dispatch, location.state, navigate, gameId, socket]);

	useEffect(() => {
		const startGameSocketHandler = () => {
			navigate(`/game/${gameId}`);
		};
		socket.on(`pregame-lobby:${gameId}:start-game`, startGameSocketHandler);
		return () => {
			socket.off(`pregame-lobby:${gameId}:start-game`, startGameSocketHandler);
		};
	}, [navigate, gameId, socket]);

	const determineGameStartable = () => {
		let numReadyPlayers = 0;

		playerStatuses.forEach((playerStatus) => {
			if (playerStatus.Players[0]?.ready) {
				numReadyPlayers++;
			}
		});

		return numReadyPlayers === playerInfo?.player_cap;
	};

	return (
		<>
			<main>
				<section className="pregame-head">
					<h1 className="pregame-head__title">{playerInfo?.room_name}</h1>
					<div className="pregame-head__subheading--playercount">
						Players: {playerStatuses.length}/{playerInfo?.player_cap}
					</div>
					<div className="pregame-head__subheading--turncap">
						Game turn limit: {playerInfo?.turn_max} turns
					</div>
					<div className="pregame-head__subheading--betcap">
						Max bet per round: {playerInfo?.bet_max}
					</div>
				</section>
				<section className="pregame-body">
					<div className="players-container">
						<h2 className="players-container__heading">Players</h2>
						{playerStatuses.length > 0 ? (
							playerStatuses.map((playerStatus) => {
								const firstPlayer = playerStatus.Players[0];
								return (
									<div key={playerStatus.id} className="players-container__player">
										<h3 className="players-container__player__username">
											{playerStatus.username}
										</h3>
										<div className="players-container__player__chipcount">
											Chips: {playerStatus.user_chips}
										</div>
										{firstPlayer?.host ? (
											<img className="player-icon--host" src="/crown.svg" alt="Host" />
										) : null}
										<div className="players-container__player__ready-heading">Ready?</div>
										{firstPlayer?.ready ? (
											<img
												className="player-icon--status"
												src="/tick-mark.svg"
												alt="Ready"
											/>
										) : (
											<img
												className="player-icon--status"
												src="/x-mark.svg"
												alt="Not ready"
											/>
										)}
									</div>
								);
							})
						) : (
							<>
								<div>
									<h2>Fetching player statuses...</h2>
								</div>
							</>
						)}
					</div>
					<div className="pregame-options">
						<button
							className="pregame-options__button"
							onClick={() => dispatch(toggleReady(gameId))}
						>
							Toggle Ready
						</button>
						<button
							className="pregame-options__button--start"
							disabled={!determineGameStartable()}
							onClick={() => dispatch(handleStartGame(gameId))}
						>
							Start Game
						</button>
						<button
							className="pregame-options__button"
							onClick={() => dispatch(leaveGame(gameId))}
						>
							Leave Game
						</button>
					</div>
				</section>
			</main>
		</>
	);
}
