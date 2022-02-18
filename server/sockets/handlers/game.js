const gameGlobals = new Map();

const joinGame = (lobbySockets, gameSockets) => (gameId, userId, username) => {
    if (undefined === gameSockets.get(gameId)) {
        gameSockets.set(gameId, new Map());
        gameGlobals.set(gameId, null);
    }
    gameSockets.get(gameId).set(userId, lobbySockets.get(userId));
    gameSockets.get(gameId).forEach(client_socket => 
        client_socket.emit(`game:${gameId}:player-joined`, {
            username
        })
    )
}

module.exports = (lobbySockets, gameSockets) => ({
    joinGame: joinGame(lobbySockets, gameSockets),
})