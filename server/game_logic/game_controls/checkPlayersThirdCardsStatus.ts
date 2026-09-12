import type { GameState } from '../types';

export const checkPlayersThirdCardsStatus = ({ Game }: { Game: GameState }): boolean => {
    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);
    return nonDealerPlayers.every(player => player.thirdCardChosen !== null);
};