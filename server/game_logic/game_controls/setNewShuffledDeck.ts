import type { Card, GameState } from '../types';
import { kabufudaDeck } from '../cardsDeck';

export const setNewShuffledDeck = ({ Game }: { Game: GameState }): void => {
    const deck: Card[] = [];
    for (let i = 0; i < kabufudaDeck.length; i++) {
        const card = kabufudaDeck[i];
        if (!card) continue;
        deck.push({ id: card.id, value: card.value, src: card.src });
    }
    Game.deck = Game.shuffle(deck);
};