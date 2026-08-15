module.exports = (socketMeta) => {
    const emitAll = (event, data) =>
        socketMeta.forEach(({ socket }) => {
            if (socket.connected) socket.emit(event, data);
        });

    return {
        createGame: (gameId, userId, username, roomName, playerCap, turnMax, betMax) =>
            emitAll('lobby:create-game', { 
				gameId, 
				userId, 
				username, 
				roomName, 
				playerCap, 
				turnMax, 
				betMax 
			}),
        joinGame: (gameId, userId, username) =>
            emitAll('lobby:join-game', { gameId, userId, username }),
        leaveGame: (gameId, userId, username) =>
            emitAll('lobby:leave-game', { gameId, userId, username }),
        startGame: (gameId, userId, username) =>
            emitAll('lobby:start-game', { gameId, userId, username }),
        endGame: (gameId, userId, username) =>
            emitAll('lobby:end-game', { gameId, userId, username }),
    };
};