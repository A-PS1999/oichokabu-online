const router = require('express').Router();
const { Game: GameSockets } = require('../sockets');
const { Game: GameDB } = require('../db/api');
const checkLoggedIn = require('./middleware/checkLoggedIn');
const checkGamePlayer = require('./middleware/checkGamePlayer');
const sendUserId = require('./middleware/sendUserId');

router.get('/api/game/:gameId/authenticate-player', checkLoggedIn, checkGamePlayer, sendUserId);

router.post('/api/game/:gameId/join', checkLoggedIn, (request, response) => {
    const { gameId } = request.params;
    const id = response.locals.user.id;
    GameSockets.setGameSockets(gameId, id);
    response.sendStatus(204);
});

router.post('/api/game/update-player-chips', checkLoggedIn, (request, response) => {
    const { newChips } = request.params;
    const id = response.locals.user.id;

    GameDB.updateChips(id, newChips).then(result => {
        return response.json(result)
    })
    .catch(error => console.log(error));
});

module.exports = router;