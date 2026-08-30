import React, { useEffect } from 'react';
import './PregameLobby.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { pregameSelector, fetchPlayerInfo, fetchPlayerStatuses, handleStartGame, toggleReady, leaveGame, pregameStateReset } from '../../store/pregameSlice';
import { createToast } from '../../store/toastSlice.js';
import { useSocket } from '../../hooks/useSocket.js';

export default function PregameLobby() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const socket = useSocket();
    const { playerInfo, playerStatuses, isError, errorMessage } = useSelector(pregameSelector);

    useEffect(() => {
        socket.emit('pregame:rejoin', { gameId: params.gameId }, (res) => {
            if (res && !res.ok) {
                dispatch(createToast({
                    message: "Failed to join lobby",
                    type: "error"
                }));
            }
        });
        dispatch(fetchPlayerStatuses(params.gameId));
        dispatch(fetchPlayerInfo(params.gameId));

        const pregameSocketHandler = () => {
            dispatch(fetchPlayerStatuses(params.gameId));
        }
        socket.on(`pregame-lobby:${params.gameId}:enter-game`, pregameSocketHandler)
        socket.on(`pregame-lobby:${params.gameId}:player-ready`, pregameSocketHandler);
        socket.on(`pregame-lobby:${params.gameId}:player-unready`, pregameSocketHandler);

        return () => {
            socket.off(`pregame-lobby:${params.gameId}:enter-game`, pregameSocketHandler);
            socket.off(`pregame-lobby:${params.gameId}:player-ready`, pregameSocketHandler);
            socket.off(`pregame-lobby:${params.gameId}:player-unready`, pregameSocketHandler);
            dispatch(pregameStateReset());
        }
    }, [dispatch, params.gameId])

    useEffect(() => {
        if (isError) {
            dispatch(createToast({
                message: errorMessage,
                type: "error",
            }));
        }
    }, [dispatch, isError, errorMessage])

    useEffect(() => {
        const leaveGameSocketHandler = (data) => {
            dispatch(fetchPlayerStatuses(params.gameId));
            if (location.state.user_id === data.userId) {
                navigate("/lobby");
            }
            if (data.hostStatus === true) {
                navigate("/lobby");
            }
        }
        socket.on(`pregame-lobby:${params.gameId}:leave-game`, leaveGameSocketHandler)
        return () => {
            socket.off(`pregame-lobby:${params.gameId}:leave-game`, leaveGameSocketHandler);
        }
    }, [dispatch, location.state.user_id, navigate, params.gameId])

    useEffect(() => {
        const startGameSocketHandler = () => {
            navigate(`/game/${params.gameId}`);
        }
        socket.on(`pregame-lobby:${params.gameId}:start-game`, startGameSocketHandler)
        return () => {
            socket.off(`pregame-lobby:${params.gameId}:start-game`, startGameSocketHandler);
        }
    }, [navigate, params.gameId])

    const determineGameStartable = () => {
        let numReadyPlayers = 0;

        playerStatuses.forEach(playerStatus => {
            if (playerStatus.Players[0].ready) {
                numReadyPlayers++;
            }
        });

        return numReadyPlayers === playerInfo.player_cap;
    };

    return (
        <>
            <main>
                <section className="pregame-head">
                    <h1 className="pregame-head__title">{playerInfo.room_name}</h1>
                    <div className="pregame-head__subheading--playercount">Players: {playerStatuses.length}/{playerInfo.player_cap}</div>
                    <div className="pregame-head__subheading--turncap">Game turn limit: {playerInfo.turn_max} turns</div>
                    <div className="pregame-head__subheading--betcap">Max bet per round: {playerInfo.bet_max}</div>
                </section>
                <section className="pregame-body">
                    <div className="players-container">
                        <h2 className="players-container__heading">Players</h2>
                        {playerStatuses.length > 0 ? playerStatuses.map((playerStatus) => {
                            return (
                                <React.Fragment key={playerStatus.id}>
                                    <div className="players-container__player">
                                        <h3 className="players-container__player__username">{playerStatus.username}</h3>
                                        <div className="players-container__player__chipcount">Chips: {playerStatus.user_chips}</div>
                                        {playerStatus.Players[0].host ? (<img className="player-icon--host" src="/crown.svg" alt="Host" />) : null}
                                        <div className="players-container__player__ready-heading">Ready?</div>
                                        {playerStatus.Players[0].ready ?
                                            (<img className="player-icon--status" src="/tick-mark.svg" alt="Ready" />)
                                            : (<img className="player-icon--status" src="/x-mark.svg" alt="Not ready" />)
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                            : <>
                                <div>
                                    <h2>Fetching player statuses...</h2>
                                </div>
                            </>
                        }
                    </div>
                    <div className="pregame-options">
                        <button className="pregame-options__button" onClick={() => dispatch(toggleReady(params.gameId))}>
                            Toggle Ready
                        </button>
                        <button className="pregame-options__button--start" disabled={!determineGameStartable()} onClick={async () => await dispatch(handleStartGame(params.gameId))}>
                            Start Game
                        </button>
                        <button className="pregame-options__button" onClick={() => dispatch(leaveGame(params.gameId))}>
                            Leave Game
                        </button>
                    </div>
                </section>
            </main>
        </>
    )
}