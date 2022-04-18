import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { gameSelector } from '../../../store/gameSlice';
import './CardsValueCounter.scss';

export default function CardsValueCounter({ cards, parentColumn }) {
    const [countSecondCard, setCountSecondCard] = useState(false);

    const { currentPhase, playerAuth, cardBets, currentDealer } = useSelector(gameSelector)

    const calculateCardsValue = useCallback(cards => {
        if (countSecondCard) {
            if (cards.length > 1) {
                const cardsSum = cards.reduce((previous, current) =>
                    previous.value + current.value
                )
                const cardsValue = cardsSum % 10;
                return cardsValue;
            }
            return cards[0].value;
        }
        if (!countSecondCard && cards.length === 3) {
            const twoCardsValue = (cards[0].value + cards[2].value) % 10;
            return twoCardsValue;
        }
        return cards[0].value;
    }, [countSecondCard]);

    useEffect(() => {
        const userBet = cardBets.find(bet => bet.userId === playerAuth.id);
        if ((currentPhase === 'scoringPhase') || (userBet && userBet.ownerColumn === parentColumn) || (parentColumn === 'D')) {
            setCountSecondCard(true);
        }
    }, [cardBets, currentDealer.id, currentPhase, parentColumn, playerAuth.id])

    return (
        <div className={parentColumn === 'D' ? "dealer-cardvalue" : "cardvalue"}>
            {calculateCardsValue(cards)}
        </div>
    )
}