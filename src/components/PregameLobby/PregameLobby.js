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

        socket.on(`pregame-lobby:${location.state.game_id}:player-ready`, () => {
            dispatch(fetchPlayerStatuses(location.state.game_id))
        })
        socket.on(`pregame-lobby:${location.state.game_id}:player-unready`, () => {
            dispatch(fetchPlayerStatuses(location.state.game_id))
        })
        socket.on(`pregame-lobby:${location.state.game_id}:leave-game`, () => {
            navigate("/lobby");
        })

        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error",
            }));
        }
    }, [dispatch, isError, errorMessage, navigate, location.state.game_id])

    return (
        <>
            <Navbar />
            <div>
                <main>
                    <section className="pregame-head">
                        <h1 className="pregame-head__title">{location.state.room_name}</h1>
                        <div className="pregame-head__subheading--playercount">Players: {playerStatuses.length}/{location.state.player_cap}</div>
                        <div className="pregame-head__subheading--turncap">Game turn limit: {location.state.turn_limit} turns</div>
                    </section>
                    <section className="pregame-body">
                        <div className="players-container">
                            <h2 className="players-container__heading">Players</h2>
                            {playerStatuses.length > 0 ? playerStatuses.map((playerStatus) => {
                                return(
                                    <React.Fragment key={playerStatus.id}>
                                        <div className="players-container__player">
                                            <h3 className="players-container__player__username">{playerStatus.username}</h3>
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
                            <button className="pregame-options__button--start" onClick={() => console.log("PLACEHOLDER")}>
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