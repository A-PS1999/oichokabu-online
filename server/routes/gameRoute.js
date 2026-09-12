const router = require('express').Router();
const { Game: GameSockets } = require('../sockets');
const checkLoggedIn = require('./middleware/checkLoggedIn');
const checkGamePlayer = require('./middleware/checkGamePlayer');
const checkGameHost = require('./middleware/checkGameHost');
const sendUserId = require('./middleware/sendUserId');

router.get('/api/game/:gameId/authenticate-player', checkLoggedIn, checkGamePlayer, sendUserId);

router.post('/api/game/:gameId/start', checkLoggedIn, checkGamePlayer, checkGameHost, (request, response) => {
    const gameId = Number(request.params.gameId);
    GameSockets.startGame(gameId);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/update', checkLoggedIn, checkGamePlayer, (request, response) => {
    const gameId = Number(request.params.gameId);
    const id = response.locals.user.id;
    GameSockets.updateGame(gameId, id);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/pickdealer-card-selected', checkLoggedIn, checkGamePlayer, (request, response) => {
    const gameId = Number(request.params.gameId);
    const cardId = request.body.cardId;
    const userId = response.locals.user.id;
    GameSockets.pickDealerCardSelected(gameId, userId, cardId);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/card-bet', checkLoggedIn, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    const { currentCard, betAmount } = request.body.betData;
    if (!currentCard) {
        return response.status(400).json({ error: "Card selection not present" });
    }
    const { id: cardId, ownerColumn } = currentCard;
    GameSockets.cardBetMade(gameId, userId, cardId, ownerColumn, betAmount);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/decide-third-card', checkLoggedIn, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    const choiceMade = request.body.choiceMade;
    const isDealer = request.body.isDealer;
    GameSockets.thirdCardChoice(gameId, userId, choiceMade, isDealer);
    response.sendStatus(204);
})

router.post('/api/game/:gameId/remove-player', checkLoggedIn, checkGamePlayer, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    GameSockets.removePlayer(gameId, userId);
    response.sendStatus(204);
})

module.exports = router;