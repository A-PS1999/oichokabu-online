import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector, selectPlayerCardBet } from '../../../store/gameSlice';
import { modalActions, modalSelector } from '../../../store/modalSlice';
import useCardsValue from '../../../utils/useCardsValue';
import './CardsValueCounter.scss';

export default function CardsValueCounter({ cards, parentColumn }) {
    const [countSecondCard, setCountSecondCard] = useState(false);
    const { currentPhase } = useSelector(gameSelector);
    const userBet = useSelector(selectPlayerCardBet);
    const { cardsValue } = useCardsValue(cards, countSecondCard);
    const dispatch = useDispatch();

    useEffect(() => {
        if ((currentPhase === 'scoringPhase') || (userBet && userBet.ownerColumn === parentColumn) || (parentColumn === 'D')) {
            setCountSecondCard(true);
        }
    }, [currentPhase, parentColumn, userBet])

    useEffect(() => {
        if (userBet && userBet.ownerColumn === parentColumn) {
            let modalNotOpened = true;
            if (modalNotOpened && (cardsValue >= 4 && cardsValue <= 6)) {
                modalNotOpened = false;
                dispatch(modalActions.toggleModal())
            }
        }
    }, [userBet, parentColumn, dispatch, cardsValue])

    return (
        <div className={parentColumn === 'D' ? "dealer-cardvalue" : "cardvalue"}>
            {cardsValue}
        </div>
    )
}