const router = require('express').Router();
const AuthRoute = require('./authRoute');
const LobbyRoute = require('./lobbyRoute');
const PreGameRoute = require('preGameRoute');

router.use(AuthRoute);
router.use(LobbyRoute);
router.use(PreGameRoute);

module.exports = router;