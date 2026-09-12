import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	setCurrentSelection,
	setHasClicked,
	selectPlayerAuth,
	selectHasClicked,
	selectIsPickDealer,
	selectCurrentDealerData,
	selectCurrentPlayer,
	selectCurrentPhase,
	selectGameId,
	postDealerCardSelected,
} from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { createToast } from '../../../store/toastSlice';
import { useSocket } from '../../../hooks/useSocket';
import { useAppDispatch } from '../../../store/hooks';
import './Card.scss';
import type {
	CardBetMadePayload,
	PickDealerCardSelectedPayload,
} from '@shared/socket-events';

export type CardProps = {
	id: number;
	value?: number | undefined;
	src: string;
	ownerColumn?: number | undefined;
	defaultHidden: boolean;
	defaultDisabled: boolean;
};

export default function Card({ id, value, src, ownerColumn, defaultHidden, defaultDisabled }: CardProps) {
	const [isHidden, setIsHidden] = useState(defaultHidden);
	const [isDisabled, setIsDisabled] = useState(defaultDisabled);
	const [revealedValue, setRevealedValue] = useState<number | undefined>(value);
	const playerAuth = useSelector(selectPlayerAuth);
	const hasClicked = useSelector(selectHasClicked);
	const isPickDealer = useSelector(selectIsPickDealer);
	const currentDealer = useSelector(selectCurrentDealerData);
	const currentPlayer = useSelector(selectCurrentPlayer);
	const currentPhase = useSelector(selectCurrentPhase);
	const gameId = useSelector(selectGameId);
	const dispatch = useAppDispatch();
	const socket = useSocket();

	const handleMainGameCardClick = () => {
		if (ownerColumn === undefined) return;
		dispatch(setCurrentSelection({ id, ownerColumn }));
		dispatch(modalActions.toggleModal());
	};

	useEffect(() => {
		if (currentPhase === 'scoringPhase') {
			setIsHidden(false);
		}
	}, [currentPhase]);

	useEffect(() => {
		if (currentPhase === 'bettingPhase' && hasClicked === true) {
			dispatch(setHasClicked(false));
		}
		if (currentPhase === 'bettingPhase') {
			setIsDisabled(false);
		}
	}, [dispatch, currentPhase, hasClicked]);

	const determineDisabled = (): boolean => {
		if (isDisabled || hasClicked || (currentDealer && playerAuth?.id === currentDealer.id)) {
			return true;
		} else if (!isPickDealer && currentPlayer && currentPlayer.id !== playerAuth?.id) {
			return true;
		} else {
			return false;
		}
	};

	const handleCardClick = () => {
		if (determineDisabled()) {
			dispatch(createToast({ message: 'You cannot currently select cards', type: 'error' }));
		} else {
			if (isPickDealer) {
				dispatch(postDealerCardSelected({ gameId: gameId ?? '', cardId: id }));
			} else {
				handleMainGameCardClick();
			}
		}
	};

	useEffect(() => {
		const dealerDecideClickHandler = (data: PickDealerCardSelectedPayload) => {
			if (data.cardId === id) {
				setRevealedValue(data.cardVal);
				setIsHidden(false);
				setIsDisabled(true);
			}
			if (playerAuth?.id && data.userId === playerAuth.id) {
				dispatch(setHasClicked(true));
			}
		};
		socket.on(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler);
		return () => {
			socket.off(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler);
		};
	}, [dispatch, gameId, playerAuth?.id, id, socket]);

	useEffect(() => {
		const cardBetSocketHandler = (data: CardBetMadePayload) => {
			if (data.userId === playerAuth?.id && data.cardId === id) {
				setIsDisabled(true);
			}
			if (playerAuth?.id && playerAuth.id === data.userId) {
				dispatch(setHasClicked(true));
			}
		};
		socket.on(`game:${gameId}:card-bet-made`, cardBetSocketHandler);
		return () => {
			socket.off(`game:${gameId}:card-bet-made`, cardBetSocketHandler);
		};
	}, [dispatch, gameId, playerAuth?.id, id, value, socket]);

	return (
		<>
			<div className="game-card">
				{isHidden ? null : (
					<div className="game-card__value-container">
						<div className="game-card__value-container__value">{revealedValue}</div>
					</div>
				)}
				<button className="game-card__button" onClick={() => handleCardClick()}>
					<div className={isHidden ? 'game-card__inner--hidden' : 'game-card__inner'}>
						<div className="game-card__side game-card__side--front">
							<img src={src} alt="Front of an Oicho Kabu card" id={String(id)} />
						</div>
						<div className="game-card__side game-card__side">
							<img src="/cards/cardback.jpg" alt="Back of an Oicho Kabu card" />
						</div>
					</div>
				</button>
			</div>
		</>
	);
}