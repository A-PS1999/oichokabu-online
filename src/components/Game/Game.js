import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setGameId, setGameState, setHasClicked } from '../../store/gameSlice';
import { useLocation } from 'react-router-dom';
import { GameAPI, PregameAPI, socket } from '../../services';
import './Game.scss';
import CardColumn from './CardColumn/CardColumn';
import Card from './Card/Card';
import Modal from '../Modal/Modal';
import PickDealerScreen from './PickDealerScreen/PickDealerScreen';
import MakeBetForm from './MakeBetForm/MakeBetForm';

export default function Game() {

    const dispatch = useDispatch();
    const location = useLocation();
    const { isPickDealer, 
        Players, 
        cardBets,
        cardsOnBoard,
        currentTurn,
        turnMax,
        currentPlayer,
        currentDealer,
        hasClicked,
        isError,
        playerAuth, 
        errorMessage } = useSelector(gameSelector);

    useEffect(() => {
        const game_id = location.state.game_id;
        dispatch(setGameId(game_id));
    }, [dispatch, location.state.game_id])

    useEffect(() => {
        if (cardBets.length === 0 && hasClicked) {
            dispatch(setHasClicked());
        }
    }, [dispatch, cardBets, hasClicked])

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

        return () => {
            if (playerAuth) {
                socket.off(`game:${location.state.game_id}:update-game`);
            }
        }
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
            <PickDealerScreen />
        )
    } 

    if (isPickDealer === false) {
        return (
            <>
                <Modal>
                    <MakeBetForm />
                </Modal>
                <div className="maingame">
                    <div className="maingame__turninfo">
                        <h2 className="maingame__turninfo__text">Turn: {currentTurn}/{turnMax}</h2>
                        <h2 className="maingame__turninfo__text">Current Player: {currentPlayer.username}</h2>
                    </div>
                    {currentDealer ? (
                        <>
                            <div className="maingame__dealerinfo">
                                <p>Dealer: <b>{currentDealer.username}</b></p>
                            </div>
                            <div className="maingame__dealercards-container">
                                {currentDealer.cardBet.map(card => {
                                    return (
                                        <Card
                                            key={card.id} 
                                            id={card.id}
                                            value={card.value}
                                            src={card.src}
                                            defaultHidden={false}
                                            defaultDisabled={true}
                                        />
                                    )
                                })}
                            </div>
                        </>
                    ) : (null)}
                    <div className="maingame__cardcolumn-container">
                        {cardsOnBoard.length > 0 ? cardsOnBoard.map((column, index) => {
                            return (
                                <CardColumn key={index} column={column} columnIndex={index} />
                            )
                        })
                        : <h2>Loading...</h2>
                    }
                    </div>
                    <div className="maingame__players-container">
                        <p className="maingame__players-container__heading">Players</p>
                        {Players.map((player) => {
                            return (
                                <React.Fragment key={player.id}>
                                    <div className="maingame__player">
                                        {player.isDealer ? (
                                            <div className='maingame__player__dealerstatus'>親</div>
                                        ) : (
                                            <div className='maingame__player__dealerstatus'>子</div>
                                        )}
                                        <div key={player.id} className="maingame__player__playerinfo">
                                            <div className='maingame__player__playerinfo__username'>{player.username}</div>
                                            <div className='maingame__player__playerinfo__chips'>Chips: {player.chips}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
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