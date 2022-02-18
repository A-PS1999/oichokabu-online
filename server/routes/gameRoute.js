const router = require('express').Router();
const { Game: GameSockets } = require('../sockets');
const { Game: GameDB } = require('../db/api');
const checkLoggedIn = require('./middleware/checkLoggedIn');

router.post('/api/:game-id/join', checkLoggedIn, (request, response) => {
    const { gameId } = request.params;
    const id = response.locals.user.id;
    const username = response.locals.user.username;
    GameSockets.join(gameId, id, username);
    response.sendStatus(204);
});

router.post('/api/update-player-chips', checkLoggedIn, (request, response) => {
    const { newChips } = request.params;
    const id = response.locals.user.id;

    GameDB.updateChips(id, newChips).then(result => {
        return response.json(result)
    })
    .catch(error => console.log(error));
});

module.exports = router;