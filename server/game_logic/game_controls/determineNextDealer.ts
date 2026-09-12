import type { GameState } from '../types';
import { nextPlayerBySeat } from './nextPlayerBySeat';

export const determineNextDealer = ({ Game }: { Game: GameState }): void => {
    const currentDealer = Game.currentDealer;
    if (!currentDealer) throw new Error('Cannot determine next dealer without a current dealer');

    const oldDealerSeat = currentDealer.seat;
    currentDealer.isDealer = null;

    const nextDealer = nextPlayerBySeat(Game, oldDealerSeat);
    Game.currentDealer = nextDealer;
    nextDealer.isDealer = true;

    const firstCard = Game.deck.pop();
    if (!firstCard) throw new Error('Cannot draw from an empty deck while rotating dealer');
    nextDealer.cardBet.push(firstCard);
};