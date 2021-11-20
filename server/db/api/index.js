const db = require('../models');
const initAuth = require('./auth.js');
const initLobby = require('./lobby.js');
const initPreGame = require('./pregame.js');
const initGame = require('./game.js');

module.exports = {
	Auth: initAuth(db),
	Game: initGame(db),
	Lobby: initLobby(db),
	PreGame: initPreGame(db),
};