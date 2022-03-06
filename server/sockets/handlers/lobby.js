const createGame = sockets => (gameId, userId, username, roomName, playerCap, turnMax, betMax) =>
	sockets.forEach(clientSocket => 
		clientSocket.emit('lobby:create-game', {
				gameId,
				userId,
				username,
				roomName,
				playerCap,
				turnMax,
				betMax
		}),
	);
	
const joinGame = sockets => (gameId, userId, username) =>
	sockets.forEach(clientSocket =>
		clientSocket.emit('lobby:join-game', { gameId, userId, username })
	);
		
const leaveGame = sockets => (gameId, userId, username) =>
	sockets.forEach(clientSocket =>
		clientSocket.emit('lobby:leave-game', { gameId, userId, username })
	);
	
const startGame = sockets => (gameId, userId, username) =>
	sockets.forEach(clientSocket =>
		clientSocket.emit('lobby:start-game', { gameId, userId, username })
	);
	
const endGame = sockets => (gameId, userId, username) =>
	sockets.forEach(clientSocket =>
		clientSocket.emit('lobby:end-game', { gameId, userId, username })
	);
	
module.exports = sockets => ({
	createGame: createGame(sockets),
	joinGame: joinGame(sockets),
	leaveGame: leaveGame(sockets),
	startGame: startGame(sockets),
	endGame: endGame(sockets),
});