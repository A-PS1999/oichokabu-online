const setGameSockets = (lobbySockets, gameSockets) => (gameId, userId) => {
    if (undefined === gameSockets.get(gameId)) {
        gameSockets.set(gameId, new Map());
    }
    gameSockets.get(gameId).set(userId, lobbySockets.get(userId));
}

const pickDealerCardSelected = gameSockets => (gameId, userId, cardId, cardVal) => {
    gameSockets.get(gameId).forEach(clientSocket => 
        clientSocket.emit(`game:${gameId}:pickdealer-card-selected`, {userId, cardId, cardVal})
    )
}

module.exports = (lobbySockets, gameSockets) => ({
    setGameSockets: setGameSockets(lobbySockets, gameSockets),
    pickDealerCardSelected: pickDealerCardSelected(gameSockets),
})