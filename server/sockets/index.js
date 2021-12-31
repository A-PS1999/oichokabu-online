const io = require('socket.io')();
const { LobbyHandler, PreGameHandler } = require('./handlers');

const lobbySockets = new Map();
const preGameSockets = new Map();
const gameSockets = new Map();

io.on('connection', socket => {
	try {
		if (socket.request.session.passport) {
			const session = socket.request.session;
			session.connections++;
			session.save();
			const { user: userId } = socket.request.session.passport;
			lobbySockets.set(userId, socket);
			socket.on('disconnect', () => {
				lobbySockets.delete(userId);
				Object.keys(gameSockets).map(gameId => gameSockets.get(gameId).delete(userId));
				Object.keys(preGameSockets).map(roomId => preGameSockets.get(roomId).delete(userId));
			});
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = {
	Lobby: LobbyHandler(lobbySockets),
	PreGameLobby: PreGameHandler(lobbySockets, preGameSockets),
};