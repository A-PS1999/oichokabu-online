import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../store/gameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { fetchPlayerAuth, setGameId, setGameState, selectPlayerStatus } from '../../store/gameSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameAPI, PregameAPI, socket } from '../../services';
import './Game.scss';
import CardColumn from './CardColumn/CardColumn';
import CardsValueCounter from './CardsValueCounter/CardsValueCounter';
import Card from './Card/Card';
import Modal from '../Modal/Modal';
import PickDealerScreen from './PickDealerScreen/PickDealerScreen';
import MakeBetForm from './MakeBetForm/MakeBetForm';
import ThirdCardModal from './ThirdCardModal/ThirdCardModal';

export default function Game() {

    const dispatch = useDispatch();
    const location = useLocation();
    let navigate = useNavigate();
    const playerStatus = useSelector(selectPlayerStatus);
    const { isPickDealer, 
        Players,
        cardsOnBoard,
        currentTurn,
        turnMax,
        currentPlayer,
        currentDealer,
        currentPhase,
        isError,
        playerAuth, 
        errorMessage 
    } = useSelector(gameSelector);

    useEffect(() => {
        const game_id = location.state.game_id;
        dispatch(setGameId(game_id));
    }, [dispatch, location.state.game_id])

    const handleUpdateGameState = useCallback(gameData => {
        console.log(gameData);
        dispatch(setGameState(gameData));
    }, [dispatch])

    useEffect(() => {
        const endGameHandler = () => {
            navigate("/lobby");
            GameAPI.postRemovePlayer(location.state.game_id);
        }
        if (currentPhase === 'checkForBustPlayers' && playerStatus.chips < 100) {
            navigate("/lobby");
            GameAPI.postRemovePlayer(location.state.game_id);
        }
        if (currentPhase === 'endGame') {
            endGameHandler();
        }
        socket.on(`game:${location.state.game_id}:end-game`, endGameHandler);

        return () => {
            if (playerAuth) {
                socket.off(`game:${location.state.game_id}:end-game`);
            }
        }
    }, [navigate, currentPhase, playerStatus, location.state.game_id])

    useEffect(() => {
        const initGame = async () => {
            dispatch(fetchPlayerAuth(location.state.game_id));
            await GameAPI.postJoinGame(location.state.game_id);

            socket.on(`game:${location.state.game_id}:update-game`, handleUpdateGameState);
        };

        initGame();

        return () => {
            if (playerAuth) {
                socket.off(`game:${location.state.game_id}:update-game`);
            }
        }
    }, [dispatch, handleUpdateGameState, location.state.game_id])

    useEffect(() => {
        const handleReloadGame = async () => {
            const { data: gameLobbyInfo } = await PregameAPI.getPlayerInfo(location.state.game_id);
            if (playerAuth && gameLobbyInfo.status === 'running' && isPickDealer === null) {
                await GameAPI.postReloadGame(location.state.game_id);
            }
        }

        handleReloadGame();
    }, [location.state.game_id, isPickDealer, playerAuth])

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
                    {currentPhase === "bettingPhase" ? <MakeBetForm /> : <ThirdCardModal />}
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
                                <CardsValueCounter cards={currentDealer.cardBet} parentColumn={'D'} />
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