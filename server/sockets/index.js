const io = require('socket.io')();
const session = require('../db/session');
const { LobbyHandler, PreGameHandler, GameHandler } = require('./handlers');

const init = server => {
	io.use(({ request }, next) => {
		session(request, request.res, next);
	});

	io.attach(server, {
		cors: {
			origin: process.env.CORS_ORIGIN,
			methods: ["GET", "POST"],
			credentials: true
		}
	});
}

// socketId -> { socket, userId }
const socketMetadata = new Map();
// userId -> Set<socketId>
const userSockets = new Map();
// gameId -> Map<userId, Set<socket>>
const gameSockets = new Map();
// pregameId -> Map<userId, Set<socket>>
const preGameSockets = new Map();

const gameHandler = GameHandler(gameSockets);
const preGameHandler = PreGameHandler(preGameSockets);
const lobbyHandler = LobbyHandler(socketMetadata);

io.on('connection', socket => {
	const passport = socket.request.session?.passport;
	if (!passport || !passport.user) {
		socket.disconnect();
		return;
	}

	const userId = passport.user;
	socketMetadata.set(socket.id, { socket, userId });
	if (!userSockets.has(userId)) {
		userSockets.set(userId, new Set());
	}
	userSockets.get(userId).add(socket.id);

	socket.on('game:rejoin', ({ gameId }, ack) => gameHandler.rejoinGame(gameId, userId, socket, ack));
	socket.on('pregame:rejoin', ({ gameId }, ack) => 
		preGameHandler.rejoinPregame(gameId, userId, socket, ack)
	);

	socket.on('disconnect', () => {
		socketMetadata.delete(socket.id);
		userSockets.get(userId)?.delete(socket.id);

		gameSockets.forEach((room, gameId) => {
			const userSocketsInRoom = room.get(userId);
			if (userSocketsInRoom) {
				userSocketsInRoom.delete(socket);
				if (userSocketsInRoom.size === 0) room.delete(userId);
			}
			if (room.size === 0) {
				gameHandler.endGame(gameId);
			}
		});
		preGameSockets.forEach(room => {
			const userSocketsInRoom = room.get(userId);
			if (userSocketsInRoom) {
				userSocketsInRoom.delete(socket);
				if (userSocketsInRoom.size === 0) room.delete(userId);
			}
		});
	});
});

module.exports = {
	init,
	Game: gameHandler,
	Lobby: lobbyHandler,
	PreGameLobby: preGameHandler,
};