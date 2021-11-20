const router = require('express').Router();
const checkLoggedIn = require('./middleware/checkLoggedIn');

const { PreGame: PreGameDB } = require('../db/api');
const { Lobby: LobbySockets, PreGameLobby: PreGameSockets } = require('../sockets');

router.get('/api/pregame-lobby/:gameId/player-info', (request, response) =>
	PreGameDB.getPlayers(request.params.gameId)
		.then(result => response.json(result))
		.catch(error => response.json({ error })),
);

router.get('/api/pregame-lobby/:gameId/game-status', checkLoggedIn, (request, response) =>
	PreGameDB.getPlayerStatuses(request.params.gameId)
		.then(result => response.json(result))
		.catch(error => response.json({ error })),
);

router.post('/api/pregame-lobby/:gameId/join-lobby', checkLoggedIn, (request, response) => {
	const { gameId } = request.params;
	const { userId } = response.locals.user;
	PreGameLobby.enterLobby(gameId, userId);
	return response.sendStatus(204);
});

router.post('/api/pregame-lobby/:gameId/join-game', checkLoggedIn, (request, response) => {
	const { gameId } = request.params;
	const { userId, username } = response.locals.user;
	return PreGameDB.joinGame(gameId, userId)
		.then(result => {
			LobbySockets.joinGame(gameId, userId, username);
			return response.json(result);
		})
		.catch(error => response.json({ error }));
	}
);

router.post('/api/pregame-lobby/:gameId/leave-game', checkLoggedIn, (request, response) => {
	const { gameId } = request.params;
	const { userId, username } = response.locals.user;
	return PreGameDB.exitGame(gameId, userId)
		.then(result => {
			LobbySockets.leaveGame(gameId, userId, username);
			PreGameLobby.leaveGame(gameId, userId, username);
			return response.json(result);
		})
		.catch(error => response.json({ error }));
	}
);

router.post('/api/pregame-lobby/:gameId/start-game', checkLoggedIn, (request, response) => {
	const { gameId } = request.params;
	const { userId, username } = response.locals.user;
	return PreGameDB.setGameReady(gameId)
		.then(result => {
			if (result.ready) {
				return PreGameDB.setGameStarted(gameId).then(result => {
					LobbySockets.startGame(gameId, userId, username);
					PreGameSockets.startGame(gameId, userId, username);
					return response.json({ message: result.status });
				})
			} else {
				return response.json({ message: response.status });
			}
		})
		.catch(error => response.json({ error }));
	}
);

router.post('/api/pregame-lobby/:gameId/toggle-ready', checkLoggedIn, (request, response) => {
	const { gameId } = request.params;
	const { userId, username } = response.locals.user;
	return PreGameDB.togglePlayerReady(gameId, userId).then(result => {
		if (result[1].ready) {
			PreGameSockets.playerReady(gameId, userId, username);
		} else {
			PreGameSockets.playerUnready(gameId, userId, username);
		}
		
		return response.json(result);
	})
	.catch(error => response.json({ error }));
});

module.exports = router;