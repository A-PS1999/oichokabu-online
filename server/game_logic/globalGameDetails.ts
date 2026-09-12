import { kabufudaDeck } from './cardsDeck';
import { PHASES } from './phases';
import type { GameConstants, GameState, OkUser, Player } from './types';

const shuffle = <T>(items: T[]): T[] => {
    const shuffled = [...items];
    let currentIndex = shuffled.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        const current = shuffled[currentIndex];
        const random = shuffled[randomIndex];
        if (current === undefined || random === undefined) {
            throw new Error('Cannot shuffle an item at an out-of-range index');
        }
        shuffled[currentIndex] = random;
        shuffled[randomIndex] = current;
    }

    return shuffled;
};

const initGameUtility = (Game: GameState): void => {
    Game.shuffle = shuffle;
};

const initCardsDeck = (Game: GameState): void => {
    Game.deck = [];
    for (let i = 0; i < kabufudaDeck.length; i++) {
        const card = kabufudaDeck[i];
        if (!card) continue;
        Game.deck.push({ id: card.id, value: card.value, src: card.src });
    }
    Game.deck = shuffle(Game.deck);
};

const initPlayers = (Game: GameState, ok_users: OkUser[]): void => {
    const players: Player[] = [];
    for (let i = 0; i < ok_users.length; i++) {
        const user = ok_users[i];
        if (!user) continue;
        players.push({
            id: user.id,
            username: user.username,
            chips: user.user_chips,
            cardBet: [],
            isDealer: null,
            thirdCardChosen: null,
            seat: 0,
        });
    }
    Game.players = shuffle(players).splice(0, ok_users.length);
    Game.players.forEach((player, index) => { player.seat = index; });
    const firstPlayer = Game.players[0];
    if (!firstPlayer) throw new Error('Cannot start a game with no players');
    Game.currentPlayer = firstPlayer;
    Game.currentDealer = null;
};

const initGameConstants = (Game: GameState, constants: GameConstants): void => {
    Game.turnMax = constants.turn_max;
    Game.betMax = constants.bet_max;
};

const initGameVariables = (Game: GameState, ok_users: OkUser[], constants: GameConstants): void => {
    Game.currentTurn = 1;
    Game.currentOverallBet = 0;
    Game.cardBets = [];
    Game.pickDealerCardsArray = [];
    Game.pickDealerReveals = [];
    Game.lastRoundResult = null;
    Game.cardsOnBoard = [];
    Game.isPickDealer = true;
    Game.currentPhase = PHASES.PICK_DEALER;
    Game.phaseEnteredAt = Date.now();
    Game.phaseDurationMs = null;
    initPlayers(Game, ok_users);
    initGameConstants(Game, constants);
    initCardsDeck(Game);
};

const initGlobalGameDetails = (ok_users: OkUser[], constants: GameConstants): GameState => {
    const Game = {} as GameState;
    initGameVariables(Game, ok_users, constants);
    initGameUtility(Game);
    return Game;
};

export { initGlobalGameDetails };