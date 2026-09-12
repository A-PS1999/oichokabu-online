import type { GameState } from '../types';

export const checkAllThirdCardsStatus = ({ Game }: { Game: GameState }): boolean => {
    return Game.players.every(player => player.thirdCardChosen !== null);
};