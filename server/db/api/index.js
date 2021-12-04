const db = require('../models');
const initAuth = require('./auth');
const initLobby = require('./lobby');
const initPreGame = require('./pregame');
const initGame = require('./game');

module.exports = {
	Auth: initAuth(db),
	Game: initGame(db),
	Lobby: initLobby(db),
	PreGame: initPreGame(db),
};