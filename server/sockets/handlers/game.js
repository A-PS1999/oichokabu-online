const setGameSockets = (lobbySockets, gameSockets) => (gameId, userId) => {
    if (undefined === gameSockets.get(gameId)) {
        gameSockets.set(gameId, new Map());
    }
    gameSockets.get(gameId).set(userId, lobbySockets.get(userId));
}

const pickDealerCardSelected = gameSockets => (gameId, userId, cardId, cardVal) => {
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
})