import React, { useEffect } from 'react';
import './PregameLobby.scss';
import Navbar from '../Navbar/Navbar.js';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { pregameSelector, fetchPlayerInfo, fetchPlayerStatuses } from '../../store/pregameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { socket, PregameAPI } from '../../services';

export default function PregameLobby() {

    const dispatch = useDispatch();
    let navigate = useNavigate();
    const location = useLocation();
    const { playerInfo, playerStatuses, isError, errorMessage } = useSelector(pregameSelector);

    useEffect(() => {
        PregameAPI.postEnterLobby(location.state.game_id);
        dispatch(fetchPlayerStatuses(location.state.game_id));
        dispatch(fetchPlayerInfo(location.state.game_id));

        const pregameSocketHandler = () => {
            dispatch(fetchPlayerStatuses(location.state.game_id));
        }
        socket.on(`pregame-lobby:${location.state.game_id}:enter-game`, pregameSocketHandler)
        socket.on(`pregame-lobby:${location.state.game_id}:player-ready`, pregameSocketHandler);
        socket.on(`pregame-lobby:${location.state.game_id}:player-unready`, pregameSocketHandler);

        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error",
            }));
        }
        return () => {
            socket.off(`pregame-lobby:${location.state.game_id}:enter-game`, pregameSocketHandler);
            socket.off(`pregame-lobby:${location.state.game_id}:player-ready`, pregameSocketHandler);
            socket.off(`pregame-lobby:${location.state.game_id}:player-unready`, pregameSocketHandler);
        }
    }, [dispatch, isError, errorMessage, navigate, location.state.game_id])

    useEffect(() => {
        const leaveGameSocketHandler = (data) => {
            dispatch(fetchPlayerStatuses(location.state.game_id));
            if (location.state.user_id === data.userId) {
                navigate("/lobby");
            }
        }
        socket.on(`pregame-lobby:${location.state.game_id}:leave-game`, leaveGameSocketHandler)
        return () => {
            socket.off(`pregame-lobby:${location.state.game_id}:leave-game`, leaveGameSocketHandler);
        }
    }, [dispatch, location.state.user_id, navigate, location.state.game_id])

    useEffect(() => {
        const startGameSocketHandler = () => {
            navigate(`/game/${location.state.game_id}`, { state: {
                game_id: location.state.game_id,
            }});
        }
        socket.on(`pregame-lobby:${location.state.game_id}:start-game`, startGameSocketHandler)
        return () => {
            socket.off(`pregame-lobby:${location.state.game_id}:start-game`, startGameSocketHandler);
        }
    }, [navigate, location.state.game_id])

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
            <Navbar />
            <div>
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
                            <button className="pregame-options__button" onClick={() => PregameAPI.postReadyStatus(location.state.game_id)}>
                                Toggle Ready
                            </button>
                            <button className="pregame-options__button--start" disabled={!determineGameStartable()} onClick={() => PregameAPI.postGameStart(location.state.game_id)}>
                                Start Game
                            </button>
                            <button className="pregame-options__button" onClick={() => PregameAPI.postLeaveGame(location.state.game_id)}>
                                Leave Game
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}