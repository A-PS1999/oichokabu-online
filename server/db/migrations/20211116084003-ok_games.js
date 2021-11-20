'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ok_games', {
		game_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		status: {
			type: Sequelize.ENUM,
			values: ['open', 'started', 'running', 'ended'],
			allowNull: false,
		},
		room_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		player_cap: {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				min: 2,
				max: 5
			},
		},
		turn_max: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 12,
			validate: {
				min: 6,
				max: 24
			},
		},
	});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ok_games');
  },
};
