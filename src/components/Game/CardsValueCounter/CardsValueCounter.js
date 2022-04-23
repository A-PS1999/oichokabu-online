import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector, selectPlayerCardBet, selectIsDealerBool } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import useCardsValue from '../../../utils/useCardsValue';
import './CardsValueCounter.scss';

export default function CardsValueCounter({ cards, parentColumn }) {
    const [countSecondCard, setCountSecondCard] = useState(false);
    const [modalNotOpened, setModalNotOpened] = useState(true);
    const { currentPhase } = useSelector(gameSelector);
    const userBet = useSelector(selectPlayerCardBet);
    const isDealer = useSelector(selectIsDealerBool);
    const { cardsValue } = useCardsValue(cards, countSecondCard);
    const dispatch = useDispatch();

    useEffect(() => {
        if ((currentPhase === 'scoringPhase') || (userBet && userBet.ownerColumn === parentColumn) || (parentColumn === 'D')) {
            setCountSecondCard(true);
        }
    }, [currentPhase, parentColumn, userBet])

    useEffect(() => {
        if (userBet && userBet.ownerColumn === parentColumn) {
            if (modalNotOpened && !cards[2] && (cardsValue >= 4 && cardsValue <= 6)) {
                setModalNotOpened(false);
                dispatch(modalActions.toggleModal());
            }
        }
    }, [modalNotOpened, userBet, parentColumn, dispatch, cards, cardsValue, currentPhase])

    useEffect(() => {
        if (currentPhase === 'dealerCardsPhase' && (parentColumn === 'D') && isDealer) {
            if (modalNotOpened && !cards[2] && (cardsValue >= 4 && cardsValue <= 6)) {
                setModalNotOpened(false);
                dispatch(modalActions.toggleModal());
            }
        }
    }, [currentPhase, modalNotOpened, cards, cardsValue, dispatch, parentColumn, isDealer])

    return (
        <div className={parentColumn === 'D' ? "dealer-cardvalue" : "cardvalue"}>
            {cardsValue}
        </div>
    )
}