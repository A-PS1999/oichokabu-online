const game_engine = require('./../../game_logic');
const { Game } = require('./../../db/api');

const gameGlobals = new Map();
const ongoingGames = new Map();

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
        gameSockets.get(gameId).forEach((socket, userId, _) => {
            ongoingGames.set(gameId, setInterval(() => tick(socket, userId, gameId), 1000));
        })
    } catch (error) {
        console.log(error)
    }
}

const loadGame = gameSockets => gameId => {
    gameSockets.get(gameId).forEach((socket, userId, _) => {
        ongoingGames.set(gameId, setInterval(() => tick(socket, userId, gameId), 1000));
    })
}

const endGame = gameId => {
    clearInterval(ongoingGames.get(gameId));
    ongoingGames.delete(gameId);
    Game.endGame(gameId);
}

const updateGame = gameSockets => (gameId, _) => {
    gameSockets.get(gameId).forEach((value, key, _) => {
        let data = game_engine.getGameData(gameGlobals.get(gameId), key);
        value.emit(`game:${gameId}:update-game`, data);
    })
}

const pickDealerCardSelected = gameSockets => (gameId, userId, cardId, cardVal) => {
    const choiceInfo = { userId, cardId, cardVal };
    game_engine.pushPickDealerCardSelection(gameGlobals.get(gameId), choiceInfo);
    gameSockets.get(gameId).forEach(clientSocket => 
        clientSocket.emit(`game:${gameId}:pickdealer-card-selected`, { userId, cardId, cardVal })
    )
}

const cardBetMade = gameSockets => (gameId, userId, cardId, betAmount) => {
    gameSockets.get(gameId).forEach(clientSocket =>
        clientSocket.emit(`game:${gameId}:card-bet-made`, { userId, cardId, betAmount })
    )
}

module.exports = (lobbySockets, gameSockets) => ({
    setGameSockets: setGameSockets(lobbySockets, gameSockets),
    pickDealerCardSelected: pickDealerCardSelected(gameSockets),
    cardBetMade: cardBetMade(gameSockets),
    startGame: startGame(gameSockets),
    loadGame: loadGame(gameSockets),
    updateGame: updateGame(gameSockets),
})