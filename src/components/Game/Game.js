import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setGameId, setGameState } from '../../store/gameSlice';
import { useLocation } from 'react-router-dom';
import { GameAPI, PregameAPI, socket } from '../../services';
import './Game.scss';
import Card from './Card/Card.js';
import Modal from '../Modal/Modal';
import MakeBetForm from './MakeBetForm/MakeBetForm';

export default function Game() {

    const dispatch = useDispatch();
    const location = useLocation();
    const { isPickDealer, 
        Players, 
        cardBets, 
        currentTurn,
        turnMax,
        pickDealerCards,
        isError,
        playerAuth, 
        errorMessage } = useSelector(gameSelector);

    useEffect(() => {
        const game_id = location.state.game_id;
        dispatch(setGameId(game_id));
    }, [dispatch, location.state.game_id])

    const handleUpdateGameState = useCallback(gameData => {
        console.log(gameData);
        dispatch(setGameState(gameData));
    }, [dispatch])

    useEffect(() => {
        GameAPI.postJoinGame(location.state.game_id);
        dispatch(fetchPlayerAuth(location.state.game_id));

        socket.on(`game:${location.state.game_id}:update-game`, handleUpdateGameState);

        const handleLoadGame = async () => {
            const { data: gameLobbyInfo } = await PregameAPI.getPlayerInfo(location.state.game_id);
            if (playerAuth && playerAuth.host.host && gameLobbyInfo.status === 'running') {
                await GameAPI.postLoadGame(location.state.game_id);
            }
        }

        handleLoadGame();
    }, [dispatch, location.state.game_id, handleUpdateGameState])

    const handleStartGame = useCallback(_ => {
        const startFunction = async () => {
            await GameAPI.postStartGame(location.state.game_id);
            GameAPI.postUpdateGame(location.state.game_id);
        };

        startFunction();
    }, [location.state.game_id]);

    useEffect(() => {
        if (isError) {
            dispatch(toastActions.createToast({
                message: errorMessage,
                type: "error",
            }))
        }
    }, [dispatch, isError, errorMessage])

    if (isPickDealer === true) {
        return (
            <div className="pickdealer-container">
                <div className='pickdealer-container__heading-group'>
                    <h1>Click one face-down card to turn it over</h1>
                    <h2>The player who chooses the highest value card will be first dealer</h2>
                </div>
                <div className='pickdealer-container__card-container'>
                    {pickDealerCards.length > 0 ? pickDealerCards.map(card => {
                        return (
                            <Card 
                                key={card.id}
                                src={card.src}
                                value={card.value} 
                                id={card.id} 
                                defaultHidden={true}
                                defaultDisabled={false}
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
    } 

    if (isPickDealer === false) {
        return (
            <>
                <div>MAIN BOARD</div>
            </>
        )
    }

    return (
        <div className="startscreen">
            {playerAuth && playerAuth.host.host ? (
                <div className="startscreen__inner">
                    <button onClick={handleStartGame} className="startscreen__inner__button">
                        Start Game
                    </button>
                </div>
            ) : (
                <div className="startscreen__inner">
                    <div className="startscreen__inner__wait-text">
                        Waiting for the host to start the game...
                    </div>
                </div>
            )}
        </div>
    )
}