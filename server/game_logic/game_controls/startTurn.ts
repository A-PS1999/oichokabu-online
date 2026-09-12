import type { GameState, Player } from '../types';
import { nextPlayerBySeat } from './nextPlayerBySeat';

export const startTurn = ({ Game, player }: { Game: GameState; player: Player }): void => {
    if (Game.currentDealer && player.id === Game.currentDealer.id) {
        Game.currentPlayer = nextPlayerBySeat(Game, player.seat);
    }
};