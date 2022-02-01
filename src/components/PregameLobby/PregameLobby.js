import React, { useEffect } from 'react';
import './PregameLobby.scss';
import Navbar from '../Navbar/Navbar.js';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { pregameSelector, fetchPlayerInfo, fetchPlayerStatuses } from '../../store/pregameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { socket } from '../../services';

export default function PregameLobby() {

    const dispatch = useDispatch();
    const location = useLocation();
    const { playerInfo, playerStatuses } = useSelector(pregameSelector);

    useEffect(() => {
        dispatch(fetchPlayerStatuses(location.state.game_id));
        dispatch(fetchPlayerInfo(location.state.game_id));
    }, [dispatch])

    return (
        <>
            <Navbar />
            <div>
                <main>
                    <h2>ROOM NAME PLACEHOLDER</h2>
                    {playerStatuses.length > 0 ? playerStatuses.map((playerStatus) => {
                        return(
                            <React.Fragment key={playerStatus.id}>
                                <div>
                                    <h3>{playerStatus.username}</h3>
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
                </main>
            </div>
        </>
    )
}