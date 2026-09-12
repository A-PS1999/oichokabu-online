import type { GameState } from '../types';

export const removePlayer = (Game: GameState, playerId: number): void => {
    Game.players = Game.players.filter(player => player.id !== playerId);
};