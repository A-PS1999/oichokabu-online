import { useCallback, useMemo } from "react";

export default function useCardsValue(cards, countSecondCard) {

    const calculateCardsValue = useCallback((cards, countSecondCard) => {
        if (countSecondCard) {
            if (cards.length > 1) {
                const cardsSum = cards.reduce((previous, current) =>
                    ({ value: previous.value + current.value })
                )
                const cardsValue = cardsSum.value % 10;
                return cardsValue;
            }
            return (cards[0].value) % 10;
        }
        if (!countSecondCard && cards.length === 3) {
            const twoCardsValue = (cards[0].value + cards[2].value) % 10;
            return twoCardsValue;
        }
        return (cards[0].value) % 10;
    }, []);

    let cardsValue = useMemo(() => {
        return calculateCardsValue(cards, countSecondCard)
    }, [calculateCardsValue, cards, countSecondCard])

    return { cardsValue }
}