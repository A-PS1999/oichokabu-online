import type { GameState, PickDealerCardBet } from '../types';
import { nextPlayerBySeat } from './nextPlayerBySeat';

export const determineFirstDealer = (Game: GameState): void => {
    const pickDealerBets = Game.cardBets as PickDealerCardBet[];
    const highestValueSelection = pickDealerBets.reduce((previous, current) =>
        current.cardVal > previous.cardVal ? current : previous,
    );
    const toBecomeFirstDealer = highestValueSelection.userId;

    const firstDealerIndex = Game.players.findIndex(player => player.id === toBecomeFirstDealer);
    const currentDealer = Game.players[firstDealerIndex];
    if (!currentDealer) throw new Error('Cannot determine the first dealer');

    if (Game.currentPlayer === currentDealer) {
        Game.currentPlayer = nextPlayerBySeat(Game, currentDealer.seat);
    }

    currentDealer.isDealer = true;
    Game.currentDealer = currentDealer;

    const firstDealerCard = Game.deck.pop();
    if (!firstDealerCard) throw new Error('Cannot draw from an empty deck for the first dealer');
    currentDealer.cardBet.push(firstDealerCard);
};