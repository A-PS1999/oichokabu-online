const kabufudaDeck = require('./cardsDeck');

const shuffle = cardsDeck => {
    let currentIndex = cardsDeck.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [cardsDeck[currentIndex], cardsDeck[randomIndex]] = [cardsDeck[randomIndex], cardsDeck[currentIndex]];
    }

    return cardsDeck;
}

const initGameUtility = Game => {
    Game.shuffle = shuffle;
    Game.pendingForInput = null;
}

const initCardsDeck = Game => {
    Game.deck = [];
    for (let i = 0; i < kabufudaDeck.length; i++) {
        let card = {
            id: kabufudaDeck[i].id,
            value: kabufudaDeck[i].value,
            src: kabufudaDeck[i].src
        }
        Game.deck.push(card);
    }
    Game.deck = shuffle(Game.deck);
}

const initPlayers = (Game, ok_users) => {
    const players = [];
    for (let i = 0; i < ok_users.length; i++) {
        let player = {
            id: ok_users[i].id,
            username: ok_users[i].username,
            chips: ok_users[i].user_chips,
            cardBet: [],
            isDealer: null,
            thirdCardChosen: null,
        }
        players.push(player);
    }
    Game.players = shuffle(players).splice(0, ok_users.length);
    Game.currentPlayerIndex = 0;
    Game.currentPlayer = Game.players[Game.currentPlayerIndex];
    Game.currentDealerIndex = null;
    Game.currentDealer = null;
}

const initGameVariables = (Game, ok_users, constants) => {
    Game.currentTurn = 1;
    Game.currentOverallBet = 0;
    Game.cardBets = [];
    Game.pickDealerCardsArray = [];
    Game.cardsOnBoard = [];
    Game.playerCount = ok_users.length;
    Game.isPickDealer = true;
    Game.currentPhase = 'pickDealer';
    initPlayers(Game, ok_users);
    initGameConstants(Game, constants);
    initCardsDeck(Game);
}

const initGameConstants = (Game, constants) => {
    Game.turnMax = constants.turn_max;
    Game.betMax = constants.bet_max;
}

const initGlobalGameDetails = (ok_users, constants) => {
    const Game = {};
    initGameVariables(Game, ok_users, constants);
    initGameUtility(Game);
    return Game;
}

module.exports = (ok_users, constants) => initGlobalGameDetails(ok_users, constants);