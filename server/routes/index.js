const router = require('express').Router();
const AuthRoute = require('./authRoute');
const LobbyRoute = require('./lobbyRoute');
const PreGameRoute = require('./preGameRoute');
const GameRoute = require('./gameRoute');

router.use(AuthRoute);
router.use(LobbyRoute);
router.use(PreGameRoute);
router.use(GameRoute);

module.exports = router;