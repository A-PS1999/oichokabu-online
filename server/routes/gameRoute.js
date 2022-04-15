const router = require('express').Router();
const { Game: GameSockets } = require('../sockets');
const { Game: GameDB } = require('../db/api');
const checkLoggedIn = require('./middleware/checkLoggedIn');
const checkGamePlayer = require('./middleware/checkGamePlayer');
const checkGameHost = require('./middleware/checkGameHost');
const sendUserId = require('./middleware/sendUserId');

router.get('/api/game/:gameId/authenticate-player', checkLoggedIn, checkGamePlayer, sendUserId);

router.post('/api/game/:gameId/join', checkLoggedIn, (request, response) => {
    const { gameId } = request.params;
    const id = response.locals.user.id;
    GameSockets.setGameSockets(gameId, id);
    response.sendStatus(204);
});

router.post('/api/game/:gameId/start', checkLoggedIn, checkGamePlayer, checkGameHost, (request, response) => {
    const { gameId } = request.params;
    GameSockets.startGame(gameId);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/load', checkLoggedIn, checkGamePlayer, checkGameHost, (request, response) => {
    const { gameId } = request.params;
    GameSockets.loadGame(gameId);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/update', checkLoggedIn, checkGamePlayer, (request, response) => {
    const { gameId } = request.params;
    const id = response.locals.user.id;
    GameSockets.updateGame(gameId, id);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/pickdealer-card-selected', checkLoggedIn, checkGamePlayer, (request, response) => {
    const { gameId } = request.params;
    const cardValue = request.body.cardVal;
    const cardId = request.body.cardId;
    const userId = response.locals.user.id;
    GameSockets.pickDealerCardSelected(gameId, userId, cardId, cardValue);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/card-bet', checkLoggedIn, (request, response) => {
    const { gameId } = request.params;
    const { betAmount: { user_id: userId, current_card: { id: cardId, ownerColumn }, betAmount } } = request.body;
    GameSockets.cardBetMade(gameId, userId, cardId, ownerColumn, betAmount);
    response.sendStatus(204);
})

router.post('/api/game/update-player-chips', checkLoggedIn, (request, response) => {
    const { newChips } = request.params;
    const id = response.locals.user.id;

    GameDB.updateChips(id, newChips).then(result => {
        return response.json(result)
    })
    .catch(error => console.log(error));
});

module.exports = router;