import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createToast } from '../../store/toastSlice.js';
import {
    setGameId, selectPlayerStatus, selectIsPickDealer,
    selectCurrentPhase, selectPlayerAuth,
    selectGameIsError, selectGameErrorMessage
} from '../../store/gameSlice.js';
import { useParams } from 'react-router-dom';
import { GameAPI } from '../../services';
import PickDealerScreen from './PickDealerScreen/PickDealerScreen.jsx';
import GameBoard from './GameBoard/GameBoard.jsx';
import StartScreen from './StartScreen/StartScreen.jsx';
import { useGame } from '../../hooks/useGame.js';

export default function Game() {

    const dispatch = useDispatch();
    const params = useParams()
    const gameId = params.gameId;
    const playerAuth = useSelector(selectPlayerAuth);
    const playerStatus = useSelector(selectPlayerStatus);
    const isPickDealer = useSelector(selectIsPickDealer);
    const currentPhase = useSelector(selectCurrentPhase);
    const isError = useSelector(selectGameIsError);
    const errorMessage = useSelector(selectGameErrorMessage);

    useEffect(() => {
        dispatch(setGameId(gameId));
    }, [dispatch, gameId]);

    useGame({
        gameId,
        currentPhase,
        playerChips: playerStatus?.chips,
    });

    const handleStartGame = useCallback(_ => {
        const startFunction = async () => {
            await GameAPI.postStartGame(gameId);
            GameAPI.postUpdateGame(gameId);
        };

        startFunction();
    }, [gameId]);

    useEffect(() => {
        if (isError) {
            dispatch(createToast({
                message: errorMessage,
                type: "error",
            }))
        }
    }, [dispatch, isError, errorMessage])

    if (isPickDealer === true) {
        return <PickDealerScreen />;
        
    }

    if (isPickDealer === false) {
        return <GameBoard />;
    }

    return (
        <StartScreen
            playerAuth={playerAuth}
            onStart={handleStartGame}
        />
    )
}