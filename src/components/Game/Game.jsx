import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createToast } from '../../store/toastSlice.js';
import {
    setGameId, selectPlayerStatus, selectIsPickDealer,
    selectCurrentPhase, selectPlayerAuth,
    selectGameIsError, selectGameErrorMessage
} from '../../store/gameSlice.js';
import { useLocation } from 'react-router-dom';
import { GameAPI } from '../../services';
import PickDealerScreen from './PickDealerScreen/PickDealerScreen.jsx';
import GameBoard from './GameBoard/GameBoard.jsx';
import StartScreen from './StartScreen/StartScreen.jsx';
import { useGame } from '../../hooks/useGame.js';

export default function Game() {

    const dispatch = useDispatch();
    const location = useLocation();
    const gameId = location.state.game_id;
    const playerStatus = useSelector(selectPlayerStatus);
    const isPickDealer = useSelector(selectIsPickDealer);
    const currentPhase = useSelector(selectCurrentPhase);
    const playerAuth = useSelector(selectPlayerAuth);
    const isError = useSelector(selectGameIsError);
    const errorMessage = useSelector(selectGameErrorMessage);

    useEffect(() => {
        dispatch(setGameId(gameId));
    }, [dispatch, gameId]);

    useGame({
        gameId,
        currentPhase,
        playerChips: playerStatus?.chips,
        playerAuth
    });

    const handleStartGame = useCallback(_ => {
        const startFunction = async () => {
            await GameAPI.postStartGame(location.state.game_id);
            GameAPI.postUpdateGame(location.state.game_id);
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