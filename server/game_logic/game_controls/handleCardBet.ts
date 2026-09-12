import type { CardBet, GameState, NewCardBet, Player } from '../types';
import { kabufudaDeck } from '../cardsDeck';

export const handleCardBet = (Game: GameState, player: Player, betInfo: NewCardBet): void => {
    const chosenCard = kabufudaDeck.find(card => card.id === betInfo.cardId);
    if (!chosenCard) throw new Error(`Unknown card ${betInfo.cardId}`);

    const bet: CardBet = { ...betInfo, value: chosenCard.value };

    Game.currentOverallBet += bet.betAmount;
    player.chips -= bet.betAmount;

    player.cardBet.push(bet);
    Game.cardBets.push(bet);
};