import type { GameState } from '../types';

export const pushPlayerThirdCard = ({ Game, playerIndex }: { Game: GameState; playerIndex: number }): void => {
    const thirdCard = Game.deck.pop();
    if (!thirdCard) throw new Error('Cannot draw a player third card');

    const player = Game.players[playerIndex];
    if (!player) throw new Error('Player not found for third card');

    const firstBet = player.cardBet[0] as { ownerColumn: number } | undefined;

    for (let j = 0; j < 4; j++) {
        const column = Game.cardsOnBoard[j];
        if (column && firstBet && column.columnId === firstBet.ownerColumn) {
            column.cards.push(thirdCard);
        }
    }

    player.thirdCardChosen = true;
    player.cardBet.push(thirdCard);
};