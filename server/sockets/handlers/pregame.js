const enterLobby = (lobbySockets, preGameSockets) => (gameId, userId) => {
	if (undefined === preGameSockets.get(gameId)) {
		preGameSockets.set(gameId, new Map())
	}
	preGameSockets.get(gameId).set(userId, lobbySockets.get(userId));
	console.log(userId)
	console.log(preGameSockets)
	preGameSockets.get(gameId).forEach(clientSocket =>
		clientSocket.emit(`pregame-lobby:${gameId}:enter-game`, gameId)
	);
};

const leaveGame = preGameSockets => (gameId, userId, username) =>
	preGameSockets.get(gameId).forEach(clientSocket =>
		clientSocket.emit(`pregame-lobby:${gameId}:leave-game`, {
			gameId,
			userId,
			username,
		}),
	);

const startGame = preGameSockets => (gameId, userId, username) =>
	preGameSockets.get(gameId).forEach(clientSocket =>
		clientSocket.emit(`pregame-lobby:${gameId}:start-game`, {
			gameId,
			userId,
			username,
		}),
	);

const playerReady = preGameSockets => (gameId, userId, username) =>
	preGameSockets.get(gameId).forEach(clientSocket =>
		clientSocket.emit(`pregame-lobby:${gameId}:player-ready`, {
			gameId,
			userId,
			username,
		}),
	);
	
const playerUnready = preGameSockets => (gameId, userId, username) =>
	preGameSockets.get(gameId).forEach(clientSocket =>
		clientSocket.emit(`pregame-lobby:${gameId}:player-unready`, {
			gameId,
			userId,
			username,
		}),
	);
	
module.exports = (lobbySockets, preGameSockets) => ({
	enterLobby: enterLobby(lobbySockets, preGameSockets),
	leaveGame: leaveGame(preGameSockets),
	startGame: startGame(preGameSockets),
	playerReady: playerReady(preGameSockets),
	playerUnready: playerUnready(preGameSockets),
});