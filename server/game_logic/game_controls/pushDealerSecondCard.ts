import type { GameState, Player } from '../types';
import { pushDealerThirdCard } from './pushDealerThirdCard';

export const pushDealerSecondCard = ({ Game, dealer }: { Game: GameState; dealer: Player }): void => {
    const secondCard = Game.deck.pop();
    if (!secondCard) throw new Error('Cannot draw a dealer second card');
    dealer.cardBet.push(secondCard);

    const firstCard = dealer.cardBet[0];
    if (!firstCard) throw new Error('Dealer has no first card');

    const total = (firstCard.value + secondCard.value) % 10;
    if (total <= 3) {
        pushDealerThirdCard({ Game, dealer });
    } else if (total >= 7) {
        dealer.thirdCardChosen = false;
    }
};