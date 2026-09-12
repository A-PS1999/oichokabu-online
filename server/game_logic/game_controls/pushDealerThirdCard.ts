import type { GameState, Player } from '../types';

export const pushDealerThirdCard = ({ Game, dealer }: { Game: GameState; dealer: Player }): void => {
    const thirdCard = Game.deck.pop();
    if (!thirdCard) throw new Error('Cannot draw a dealer third card');
    dealer.cardBet.push(thirdCard);
    dealer.thirdCardChosen = true;
};