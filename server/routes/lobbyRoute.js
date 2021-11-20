const router = require('express').Router();
const checkLoggedIn = require('./middleware/checkLoggedIn');

const { Lobby: LobbyDB } = require('../db/api');
const { Lobby: LobbySockets } = require('../sockets');

router.post('/api/lobby/create-game', checkLoggedIn, (request, response) =>
	LobbyDB.addGame(request.user.id, request.body.room_name, request.body.player_cap, request.body.turn_max)
	.then(result => {
		const { userId, username } = response.locals.user;
		LobbySockets.createGame(result.game_id, userId, username, result.room_name, result.player_cap, result.turn_max);
		
		return response.json(result);
	})
	.catch(error => response.json({ error })),
);

router.get('/api/lobby/lobbies', (request, response) => {
	return LobbyDB.findOngoingGames()
	.then(ongoingGames => {
		return response.json({ ongoingGames });
	})
	.catch(error => response.json({ error }));
});

module.exports = router;