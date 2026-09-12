// @vitest-environment node
import { describe, it, expect } from 'vitest';
import engine from './index.js';
import game_controls from './game_controls/index.js';

const CARD = (id, value) => ({ id, value, src: `/cards/c${id}.jpg` });

const ok_users = [
    { id: 1, username: 'alice', user_chips: 1000 },
    { id: 2, username: 'bob', user_chips: 1000 },
    { id: 3, username: 'carol', user_chips: 1000 },
    { id: 4, username: 'dave', user_chips: 1000 },
];
const constants = { turn_max: 5, bet_max: 500 };

const startGame = () => engine.start(ok_users, constants);

// Overwrite the (randomly ordered) players with a fixed seat ordering.
const setPlayers = (Game, ids) => {
    Game.players = ids.map((id, seat) => ({
        id,
        username: `u${id}`,
        chips: 1000,
        cardBet: [],
        isDealer: null,
        thirdCardChosen: null,
        seat,
    }));
    Game.currentPlayer = Game.players[0];
    Game.currentDealer = null;
    return Game;
};

describe('player seating', () => {
    it('assigns contiguous seats 0..n-1 on game start', () => {
        const Game = startGame();
        expect(Game.players.map(p => p.seat).sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
        expect(Game.players.every((p, i) => p.seat === i)).toBe(true);
    });
});

describe('nextPlayerBySeat', () => {
    it('returns the next higher seat, wrapping to the lowest seat', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        expect(game_controls.nextPlayerBySeat(Game, 0).id).toBe(2);
        expect(game_controls.nextPlayerBySeat(Game, 1).id).toBe(3);
        expect(game_controls.nextPlayerBySeat(Game, 2).id).toBe(4);
        expect(game_controls.nextPlayerBySeat(Game, 3).id).toBe(1);
    });

    it('skips removed seats when finding the next player', () => {
        const Game = setPlayers(startGame(), [1, 2, 4]); // seat 2 removed
        expect(game_controls.nextPlayerBySeat(Game, 1).id).toBe(4);
        expect(game_controls.nextPlayerBySeat(Game, 4).id).toBe(1);
    });
});

describe('determineNextDealer', () => {
    it('rotates to the next seat by seat order', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.deck = [CARD(90, 5)];
        Game.currentDealer = Game.players[0];
        Game.currentDealer.isDealer = true;
        game_controls.determineNextDealer({ Game });
        expect(Game.currentDealer.id).toBe(2);
        expect(Game.currentDealer.isDealer).toBe(true);
        expect(Game.players[0].isDealer).toBe(null);
    });

    it('picks the seat after a removed player seated before the dealer', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.deck = [CARD(90, 5)];
        Game.currentDealer = Game.players[1]; // seat 1
        Game.currentDealer.isDealer = true;
        engine.handleRemovePlayer(Game, 2); // remove seat 1 -> seats [0, 2, 3]
        game_controls.determineNextDealer({ Game });
        expect(Game.currentDealer.id).toBe(3); // seat 2
        expect(Game.currentDealer.seat).toBe(2);
    });

    it('wraps to the lowest remaining seat after removing a lower seat', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.deck = [CARD(90, 5)];
        Game.currentDealer = Game.players[3]; // seat 3
        Game.currentDealer.isDealer = true;
        engine.handleRemovePlayer(Game, 1); // remove seat 0 -> seats [1, 2, 3]
        game_controls.determineNextDealer({ Game });
        expect(Game.currentDealer.id).toBe(2); // lowest remaining seat
    });

    it('handles a busted dealer: next dealer is the seat after the old dealer seat', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.deck = [CARD(90, 5)];
        Game.currentDealer = Game.players[2]; // seat 2
        Game.currentDealer.isDealer = true;
        engine.handleRemovePlayer(Game, 3); // remove the dealer -> seats [0, 1, 3]
        game_controls.determineNextDealer({ Game });
        expect(Game.currentDealer.id).toBe(4); // seat 3, next after old seat 2
    });
});

describe('handleEndTurn', () => {
    it('advances by seat order and wraps', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.currentDealer = null;
        Game.currentOverallBet = 0;
        Game.betMax = 100;
        Game.currentPlayer = Game.players[1]; // seat 1
        engine.handleEndTurn(Game);
        expect(Game.currentPlayer.id).toBe(3); // seat 2
        engine.handleEndTurn(Game);
        expect(Game.currentPlayer.id).toBe(4); // seat 3
        engine.handleEndTurn(Game);
        expect(Game.currentPlayer.id).toBe(1); // wrap to seat 0
    });

    it('skips removed seats when advancing turns', () => {
        const Game = setPlayers(startGame(), [1, 2, 3, 4]);
        Game.currentDealer = null;
        Game.currentOverallBet = 0;
        Game.betMax = 100;
        engine.handleRemovePlayer(Game, 3); // remove seat 2 -> seats [0, 1, 3]
        Game.currentPlayer = Game.players[1]; // seat 1
        engine.handleEndTurn(Game);
        expect(Game.currentPlayer.id).toBe(4); // seat 3, seat 2 removed
    });
});

describe('full round flow with seating', () => {
    // Pushed first = popped last; rigDeck[8] is the first card drawn.
    const rigDeck = () => [
        CARD(33, 3), // dealer second card (2 + 3 = 5)
        CARD(31, 1), // user3 second card (3 + 1 = 4)
        CARD(22, 2), // user2 second card (2 + 2 = 4)
        CARD(13, 3), // user1 second card (1 + 3 = 4)
        CARD(4, 4),  // board column 3 (unused)
        CARD(3, 3),  // board column 2 (user3 bets)
        CARD(12, 2), // board column 1 (user2 bets)
        CARD(1, 1),  // board column 0 (user1 bets)
        CARD(2, 2),  // dealer first card
    ];

    it('runs a round and rotates the dealer to the next seat', () => {
        const Game = startGame();
        Game.players = [
            { id: 1, username: 'alice', chips: 1000, cardBet: [], isDealer: null, thirdCardChosen: null, seat: 0 },
            { id: 2, username: 'bob', chips: 1000, cardBet: [], isDealer: null, thirdCardChosen: null, seat: 1 },
            { id: 3, username: 'carol', chips: 1000, cardBet: [], isDealer: null, thirdCardChosen: null, seat: 2 },
            { id: 4, username: 'dave', chips: 1000, cardBet: [], isDealer: null, thirdCardChosen: null, seat: 3 },
        ];
        Game.currentPlayer = Game.players[0];
        Game.deck = rigDeck();

        Game.pickDealerCardsArray = [CARD(101, 1), CARD(102, 2), CARD(103, 3), CARD(104, 4)];
        engine.pushPickDealerCardSelection(Game, { userId: 1, cardId: 101 });
        engine.pushPickDealerCardSelection(Game, { userId: 3, cardId: 103 });
        engine.pushPickDealerCardSelection(Game, { userId: 2, cardId: 102 });
        engine.pushPickDealerCardSelection(Game, { userId: 4, cardId: 104 });
        expect(Game.currentPhase).toBe('dealerReveal');
        expect(Game.currentDealer.id).toBe(4);

        engine.advance(Game);
        expect(Game.currentPhase).toBe('bettingPhase');
        expect(Game.currentPlayer.id).toBe(1);

        engine.pushCardBet(Game, { userId: 1, cardId: 1, ownerColumn: 0, betAmount: 100 });
        expect(Game.currentPlayer.id).toBe(2);
        engine.pushCardBet(Game, { userId: 2, cardId: 12, ownerColumn: 1, betAmount: 100 });
        expect(Game.currentPlayer.id).toBe(3);
        engine.pushCardBet(Game, { userId: 3, cardId: 3, ownerColumn: 2, betAmount: 100 });
        expect(Game.currentPhase).toBe('decideThirdCardPhase');

        engine.handleOptionalThirdPlayerCard(Game, 1, 'no');
        engine.handleOptionalThirdPlayerCard(Game, 2, 'no');
        engine.handleOptionalThirdPlayerCard(Game, 3, 'no');
        expect(Game.currentPhase).toBe('dealerCardsPhase');

        engine.handleOptionalThirdDealerCard(Game, 'no');
        expect(Game.currentPhase).toBe('roundResults');
        expect(Game.lastRoundResult.turn).toBe(1);
        expect(Game.lastRoundResult.results).toHaveLength(3);

        engine.advance(Game);
        expect(Game.currentPhase).toBe('bettingPhase');
        expect(Game.currentTurn).toBe(2);
        expect(Game.currentDealer.id).toBe(1);
        expect(Game.currentDealer.seat).toBe(0);
    });
});
