import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setPlayers } from '../../store/gameSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket, GameAPI } from '../../services';
import kabufudaDeck from './cardsDeck';
import Card from './Card/Card.js';
import { shuffleDeck } from '../../utils/shuffleUtil';

export default function Game() {

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [deck, setDeck] = useState(null);
    const { isPickDealer, Players, isError, errorMessage} = useSelector(gameSelector);

    useEffect(() => {
        dispatch(fetchPlayerAuth(location.state.game_id));
    }, [dispatch, location.state.game_id])

    useEffect(() => {
        GameAPI.postJoinGame(location.state.game_id);
        setDeck(shuffleDeck(kabufudaDeck));

        delete location.state.player_data.Players;
        location.state.player_data.betCards = [];
        dispatch(setPlayers(location.state.player_data))

    }, [location.state.game_id, setDeck, location.state.player_data, dispatch])

    useEffect(() => {
        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error",
            }))
        }
    }, [dispatch, isError, errorMessage])

    if (isPickDealer) {
        return (
            <div>
                {deck.slice(0, Players.length).map(card => {
                    return (
                        <Card src={card.src} id={card.id} value={card.value}  />
                    )
                })}
            </div>
        )
    }

}