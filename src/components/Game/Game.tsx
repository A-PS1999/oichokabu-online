import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createToast } from '../../store/toastSlice';
import {
	setGameId,
	selectIsPickDealer,
	selectCurrentPhase,
	selectPlayerAuth,
	selectGameIsError,
	selectGameErrorMessage,
} from '../../store/gameSlice';
import { useParams } from 'react-router';
import { GameAPI } from '../../services';
import PickDealerScreen from './PickDealerScreen/PickDealerScreen';
import GameBoard from './GameBoard/GameBoard';
import StartScreen from './StartScreen/StartScreen';
import { useGame } from '../../hooks/useGame';
import { useAppDispatch } from '../../store/hooks';

export default function Game() {
	const dispatch = useAppDispatch();
	const params = useParams<{ gameId: string }>();
	const gameId = params.gameId ?? '';
	const playerAuth = useSelector(selectPlayerAuth);
	const isPickDealer = useSelector(selectIsPickDealer);
	const currentPhase = useSelector(selectCurrentPhase);
	const isError = useSelector(selectGameIsError);
	const errorMessage = useSelector(selectGameErrorMessage);

	useEffect(() => {
		dispatch(setGameId(gameId));
	}, [dispatch, gameId]);

	useGame({
		gameId,
		gamePhase: currentPhase,
	});

	const handleStartGame = useCallback(() => {
		const startFunction = async () => {
			await GameAPI.postStartGame(gameId);
			GameAPI.postUpdateGame(gameId);
		};

		void startFunction();
	}, [gameId]);

	useEffect(() => {
		if (isError) {
			dispatch(
				createToast({
					message: errorMessage,
					type: 'error',
				}),
			);
		}
	}, [dispatch, isError, errorMessage]);

	if (isPickDealer === true) {
		return <PickDealerScreen />;
	}

	if (isPickDealer === false) {
		return <GameBoard />;
	}

	return <StartScreen playerAuth={playerAuth} onStart={handleStartGame} />;
}