import React, { useCallback } from 'react';

export default function CardsValueCounter({ cards }) {

    const calculateCardsValue = useCallback(cards => {
        if (cards.length > 1) {
            const cardsSum = cards.reduce((previous, current) =>
                previous.value + current.value
            )
            const cardsValue = cardsSum % 10;
            return cardsValue;
        }
        return cards[0].value;
    }, []);

    return (
        <div>
            {calculateCardsValue(cards)}
        </div>
    )
}