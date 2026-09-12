import type { GameState } from '../types';
import { determineNextDealer } from './determineNextDealer';
import { setNewShuffledDeck } from './setNewShuffledDeck';

export const prepNextRound = ({ Game }: { Game: GameState }): void => {
    Game.currentTurn++;
    Game.currentOverallBet = 0;
    Game.cardBets = [];
    Game.lastRoundResult = null;

    for (let i = 0; i < Game.players.length; i++) {
        const player = Game.players[i];
        if (!player) continue;
        player.cardBet = [];
        player.thirdCardChosen = null;
    }

    if (Game.deck.length <= 12) {
        setNewShuffledDeck({ Game });
    }

    determineNextDealer({ Game });

    for (let i = 0; i < 4; i++) {
        const card = Game.deck.pop();
        if (!card) throw new Error('Cannot draw a board card for the next round');
        const column = Game.cardsOnBoard[i];
        if (column) {
            column.cards = [card];
        }
    }
};