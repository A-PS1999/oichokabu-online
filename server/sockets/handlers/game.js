const game_engine = require('./../../game_logic');
const { Game } = require('./../../db/api');

const gameGlobals = new Map();
const ongoingGames = {};

const setGameSockets = (lobbySockets, gameSockets) => (gameId, userId) => {
    if (undefined === gameSockets.get(gameId)) {
        gameSockets.set(gameId, new Map());
        gameGlobals.set(gameId, null);
    }
    gameSockets.get(gameId).set(userId, lobbySockets.get(userId));
}

const tick = (socket, userId, gameId) => {
    let data = game_engine.getGameData(gameGlobals.get(gameId), userId);
    if (data.general_data.currentTurn > data.general_data.turnMax) {
        endGame(gameId);
    }
    socket.emit(`game:${gameId}:update-game`, data);
}

const startGame = gameSockets => async (gameId) => {
    try {
        Game.runGame(gameId);
        const ok_users = await Game.getUserIdsAndUsernames(gameId);
        const constants = await Game.getGameConstants(gameId);
        gameGlobals.set(gameId, game_engine.start(ok_users, constants));
        ongoingGames[gameId] = [];
        gameSockets.get(gameId).forEach((socket, userId, _) => {
            ongoingGames[gameId].push({ id: userId, timer: setInterval(() => tick(socket, userId, gameId), 1000)});
        })
    } catch (error) {
        console.log(error);
    }
}

const endGame = gameId => {
    const timersToDestroy = ongoingGames[gameId];
    for (let i = 0; i < timersToDestroy.length; i++) {
        clearInterval(timersToDestroy[i].timer);
    }
    delete ongoingGames[gameId];
    Game.endGame(gameId);
}

const updateGame = gameSockets => (gameId, _) => {
    gameSockets.get(gameId).forEach((value, key, _) => {
        let data = game_engine.getGameData(gameGlobals.get(gameId), key);
        value.emit(`game:${gameId}:update-game`, data);
    })
}

const reloadGame = gameSockets => (gameId, userId) => {
    const socket = gameSockets.get(gameId).get(userId);
    const timerToReset = ongoingGames[gameId].find(element => element.id === userId);
    timerToReset.timer = setInterval(() => tick(socket, userId, gameId), 1000);
    gameSockets.get(gameId).forEach((value, key, _) => {
        let data = game_engine.getGameData(gameGlobals.get(gameId), key);
        value.emit(`game:${gameId}:update-game`, data);
    });
}

const pickDealerCardSelected = gameSockets => (gameId, userId, cardId, cardVal) => {
    const choiceInfo = { userId, cardId, cardVal };
    game_engine.pushPickDealerCardSelection(gameGlobals.get(gameId), choiceInfo);
    gameSockets.get(gameId).forEach(clientSocket => 
        clientSocket.emit(`game:${gameId}:pickdealer-card-selected`, { userId, cardId, cardVal })
    )
}

const cardBetMade = gameSockets => (gameId, userId, cardId, ownerColumn, betAmount) => {
    const betInfo = { userId, cardId, ownerColumn, betAmount };
    game_engine.pushCardBet(gameGlobals.get(gameId), betInfo);
    gameSockets.get(gameId).forEach(clientSocket =>
        clientSocket.emit(`game:${gameId}:card-bet-made`, { userId, cardId })
    )
}

const thirdCardChoice = gameSockets => (gameId, userId, choiceMade, isDealer) => {
    if (!isDealer) {
        game_engine.handleOptionalThirdPlayerCard(gameGlobals.get(gameId), userId, choiceMade);
    }
    if (isDealer) {
        game_engine.handleOptionalThirdDealerCard(gameGlobals.get(gameId), choiceMade);
    }
    gameSockets.get(gameId).forEach((value, key, _) => {
        let data = game_engine.getGameData(gameGlobals.get(gameId), key);
        value.emit(`game:${gameId}:update-game`, data);
    })
}

const removePlayer = gameSockets => (gameId, userId) => {
    game_engine.handleRemovePlayer(gameGlobals.get(gameId), userId);
    Game.removePlayer(gameId, userId).then(_ => {
        gameSockets.get(gameId).forEach((value, key, _) => {
            let data = game_engine.getGameData(gameGlobals.get(gameId), key);
            value.emit(`game:${gameId}:update-game`, data);
        });
    })
}

module.exports = (lobbySockets, gameSockets) => ({
    setGameSockets: setGameSockets(lobbySockets, gameSockets),
    pickDealerCardSelected: pickDealerCardSelected(gameSockets),
    cardBetMade: cardBetMade(gameSockets),
    thirdCardChoice: thirdCardChoice(gameSockets),
    startGame: startGame(gameSockets),
    updateGame: updateGame(gameSockets),
    reloadGame: reloadGame(gameSockets),
    removePlayer: removePlayer(gameSockets),
})