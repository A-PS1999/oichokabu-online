import { useCallback, useMemo } from 'react';

export type CountableCard = {
	value: number;
};

export default function useCardsValue(
	cards: ReadonlyArray<CountableCard>,
	countSecondCard: boolean,
): { cardsValue: number } {
	const calculateCardsValue = useCallback(
		(cardsToCount: ReadonlyArray<CountableCard>, countSecond: boolean): number => {
			if (countSecond) {
				if (cardsToCount.length > 1) {
					const cardsSum = cardsToCount.reduce((previous, current) => ({
						value: previous.value + current.value,
					}));
					return cardsSum.value % 10;
				}
				return (cardsToCount[0]?.value ?? 0) % 10;
			}
			if (!countSecond && cardsToCount.length === 3) {
				const firstCard = cardsToCount[0]?.value ?? 0;
				const thirdCard = cardsToCount[2]?.value ?? 0;
				return (firstCard + thirdCard) % 10;
			}
			return (cardsToCount[0]?.value ?? 0) % 10;
		},
		[],
	);

	const cardsValue = useMemo(() => {
		return calculateCardsValue(cards, countSecondCard);
	}, [calculateCardsValue, cards, countSecondCard]);

	return { cardsValue };
}
