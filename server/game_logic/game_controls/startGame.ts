import { initGlobalGameDetails } from '../globalGameDetails';
import type { GameConstants, GameState, OkUser } from '../types';

export const startGame = ({ ok_users }: { ok_users: OkUser[] }, constants: GameConstants): GameState => {
    const Game = initGlobalGameDetails(ok_users, constants);
    for (let i = 0; i < ok_users.length; i++) {
        const card = Game.deck.pop();
        if (!card) throw new Error('Cannot draw from an empty deck while starting');
        Game.pickDealerCardsArray.push(card);
    }
    return Game;
};