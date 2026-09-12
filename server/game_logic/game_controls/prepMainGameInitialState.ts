import type { GameState } from '../types';

export const prepMainGameInitialState = (Game: GameState): void => {
    Game.cardBets = [];
    Game.isPickDealer = false;
    Game.pickDealerCardsArray = [];

    for (let i = 0; i < 4; i++) {
        const card = Game.deck.pop();
        if (!card) throw new Error('Cannot draw a board card');
        Game.cardsOnBoard[i] = { columnId: i, cards: [card] };
    }
};