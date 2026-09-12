import type { GameState } from '../types';

export const setThirdCardBool = (Game: GameState): void => {
    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);
    const nonBetPlayers = nonDealerPlayers.filter(player => Game.cardBets.find(bet => bet.userId !== player.id));

    for (let i = 0; i < nonBetPlayers.length; i++) {
        const nonBetPlayer = nonBetPlayers[i];
        if (!nonBetPlayer) continue;
        const playerIndex = Game.players.findIndex(player => player.id === nonBetPlayer.id);
        const player = Game.players[playerIndex];
        if (player) {
            player.thirdCardChosen = false;
        }
    }
};