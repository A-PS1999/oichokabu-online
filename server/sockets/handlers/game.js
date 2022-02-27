const setGameSockets = (lobbySockets, gameSockets) => (gameId, userId) => {
    if (undefined === gameSockets.get(gameId)) {
        gameSockets.set(gameId, new Map());
    }
    gameSockets.get(gameId).set(userId, lobbySockets.get(userId));
}

module.exports = (lobbySockets, gameSockets) => ({
    setGameSockets: setGameSockets(lobbySockets, gameSockets),
})