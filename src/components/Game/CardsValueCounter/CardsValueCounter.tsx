import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	selectCurrentPhase,
	selectPlayerCardBet,
	selectIsDealerBool,
	selectPlayerStatus,
} from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { useAppDispatch } from '../../../store/hooks';
import useCardsValue, { type CountableCard } from '../../../hooks/useCardsValue';
import './CardsValueCounter.scss';

export type CardsValueCounterProps = {
	cards: ReadonlyArray<CountableCard>;
	parentColumn: number | 'D';
};

export default function CardsValueCounter({ cards, parentColumn }: CardsValueCounterProps) {
	const [countSecondCard, setCountSecondCard] = useState(false);
	const [modalNotOpened, setModalNotOpened] = useState(true);
	const currentPhase = useSelector(selectCurrentPhase);
	const userBet = useSelector(selectPlayerCardBet);
	const playerStatus = useSelector(selectPlayerStatus);
	const isDealer = useSelector(selectIsDealerBool);
	const { cardsValue } = useCardsValue(cards, countSecondCard);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (
			currentPhase === 'scoringPhase' ||
			currentPhase === 'roundResults' ||
			(userBet && userBet.ownerColumn === parentColumn) ||
			parentColumn === 'D'
		) {
			setCountSecondCard(true);
		}
		if (currentPhase === 'bettingPhase') {
			setCountSecondCard(false);
		}
	}, [currentPhase, parentColumn, userBet]);

	useEffect(() => {
		if (userBet && userBet.ownerColumn === parentColumn) {
			if (
				modalNotOpened &&
				playerStatus?.thirdCardChosen === null &&
				!cards[2] &&
				cardsValue >= 4 &&
				cardsValue <= 6
			) {
				setModalNotOpened(false);
				dispatch(modalActions.toggleModal());
			}
		}
		if (currentPhase === 'bettingPhase') {
			setModalNotOpened(true);
		}
	}, [modalNotOpened, userBet, parentColumn, dispatch, cards, cardsValue, currentPhase, playerStatus]);

	useEffect(() => {
		if (currentPhase === 'dealerCardsPhase' && parentColumn === 'D' && isDealer) {
			if (
				modalNotOpened &&
				playerStatus?.thirdCardChosen === null &&
				!cards[2] &&
				cardsValue >= 4 &&
				cardsValue <= 6
			) {
				setModalNotOpened(false);
				dispatch(modalActions.toggleModal());
			}
		}
	}, [currentPhase, modalNotOpened, cards, cardsValue, dispatch, parentColumn, isDealer, playerStatus]);

	return <div className={parentColumn === 'D' ? 'dealer-cardvalue' : 'cardvalue'}>{cardsValue}</div>;
}