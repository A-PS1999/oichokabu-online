'use strict';

const { Sequelize } = require('sequelize');
const dbConnection = require('../db.js');

const db = {
  ok_games: require('./games.js')(dbConnection, Sequelize),
  ok_players: require('./players.js')(dbConnection, Sequelize),
  ok_users: require('./users.js')(dbConnection, Sequelize),
  sessions: require('./sessions.js')(dbConnection, Sequelize),
};

Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = dbConnection;
db.Sequelize = Sequelize;

module.exports = db;
