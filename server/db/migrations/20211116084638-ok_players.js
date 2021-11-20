'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ok_players', {
		player_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		player_userid: {
			type: Sequelize.INTEGER,
			references: { model: 'ok_users', key: 'user_id' },
		},
		player_gameid: {
			type: Sequelize.INTEGER,
			references: { model: 'ok_games', key: 'game_id' },
		},
		ready: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		host: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ok_players');
  },
};
