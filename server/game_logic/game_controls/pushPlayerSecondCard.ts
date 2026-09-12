import type { CardBet, GameState } from '../types';
import { pushPlayerThirdCard } from './pushPlayerThirdCard';

export const pushPlayerSecondCard = ({ Game }: { Game: GameState }): void => {
    const betPlayers = Game.players.filter(player => Game.cardBets.find(bet => bet.userId === player.id));

    for (let i = 0; i < betPlayers.length; i++) {
        const betPlayer = betPlayers[i];
        if (!betPlayer) continue;

        const secondCard = Game.deck.pop();
        if (!secondCard) throw new Error('Cannot draw a player second card');

        const playerIndex = Game.players.findIndex(player => player.id === betPlayer.id);
        const player = Game.players[playerIndex];
        if (!player) continue;

        const firstBet = player.cardBet[0] as CardBet | undefined;
        if (!firstBet) continue;

        for (let j = 0; j < 4; j++) {
            const column = Game.cardsOnBoard[j];
            if (column && column.columnId === firstBet.ownerColumn) {
                column.cards.push(secondCard);
            }
        }

        player.cardBet.push(secondCard);

        const total = (firstBet.value + secondCard.value) % 10;
        if (total <= 3) {
            pushPlayerThirdCard({ Game, playerIndex });
        } else if (total >= 7) {
            player.thirdCardChosen = false;
        }
    }
};