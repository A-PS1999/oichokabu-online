import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setGameValues } from '../../store/gameSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket, GameAPI } from '../../services';
import './Game.scss';
import Card from './Card/Card.js';

export default function Game() {

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [deck, setDeck] = useState([]);
    const { isPickDealer, Players, isError, errorMessage } = useSelector(gameSelector);

    useEffect(() => {
        dispatch(fetchPlayerAuth(location.state.game_id));
        const dataToDispatch = {
            player_data: location.state.player_data,
            turn_max: location.state.turn_max
        }
        dispatch(setGameValues(dataToDispatch))
    }, [dispatch, location.state.game_id, location.state.player_data, location.state.turn_max])

    useEffect(() => {
        GameAPI.postJoinGame(location.state.game_id);

        const fetchDeck = async (gameId) => {
            const deckResult = await GameAPI.getDeck(gameId);
            setDeck(deckResult.data);
        }
        fetchDeck(location.state.game_id);
    }, [location.state.game_id, setDeck])

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
            <div className="pickdealer-container">
                <div className='pickdealer-container__heading-group'>
                    <h1>Click one face-down card to turn it over</h1>
                    <h2>The player who chooses the highest value card will be first dealer</h2>
                </div>
                <div className='pickdealer-container__card-container'>
                    {deck.length > 0 ? deck.slice(0, Players.length).map(card => {
                        return (
                            <React.Fragment key={card.id}>
                                <Card src={card.src} value={card.value} id={card.id} isHidden={true} />
                            </React.Fragment>
                        )
                    })
                    : <>
                        <h2 className='pickdealer-container__loading'>Loading...</h2>
                    </>
                    }
                </div>
            </div>
        )
    }

}