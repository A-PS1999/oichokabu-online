import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setGameValues, prepMainGameInitialState } from '../../store/gameSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameAPI } from '../../services';
import './Game.scss';
import Card from './Card/Card.js';
import Modal from '../Modal/Modal';
import MakeBetForm from './MakeBetForm/MakeBetForm';

export default function Game() {

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [deck, setDeck] = useState([]);
    const { isPickDealer, 
        Players, 
        cardSelections, 
        currentTurn,
        turnMax,
        isError, 
        errorMessage } = useSelector(gameSelector);

    useEffect(() => {
        const dataToDispatch = {
            player_data: location.state.player_data,
            turn_max: location.state.turn_max,
            bet_max: location.state.bet_max
        }
        dispatch(setGameValues(dataToDispatch))
    }, [dispatch, location.state.game_id, location.state.player_data, location.state.turn_max, location.state.bet_max])

    useEffect(() => {
        GameAPI.postJoinGame(location.state.game_id);
        dispatch(fetchPlayerAuth(location.state.game_id));

        const fetchDeck = async (gameId) => {
            const deckResult = await GameAPI.getDeck(gameId);
            setDeck(deckResult.data);
        }
        fetchDeck(location.state.game_id);
    }, [dispatch, location.state.game_id, setDeck])

    useEffect(() => {
        const determineHighestValueCard = () => {
            let highestValueSelection = cardSelections.reduce((current, previous) => 
                current.cardVal > previous.cardVal ? current : previous
            )
            return highestValueSelection.userId;
        }
        if (isPickDealer && cardSelections.length > 0 && cardSelections.length === Players.length) {
            const firstDealer = determineHighestValueCard();
            dispatch(prepMainGameInitialState(firstDealer));
        }
    }, [dispatch, cardSelections, Players, isPickDealer])

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
                            <Card 
                                key={card.id}
                                src={card.src}
                                game_id={location.state.game_id} 
                                value={card.value} 
                                id={card.id} 
                                defaultVisibility={true} 
                            />
                        )
                    })
                    : <>
                        <h2 className='pickdealer-container__loading'>Loading...</h2>
                    </>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <>
                <Modal>
                    <MakeBetForm />
                </Modal>
                <div className="maingame">
                    <div className="maingame__info-container">
                        <h2>Turn: {currentTurn}/{turnMax}</h2>
                    </div>
                </div>
            </>
        )
    }
}