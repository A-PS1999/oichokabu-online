'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('sessions', {
		session_id: {
			type: Sequelize.STRING,
			allowNull: false,
			primaryKey: true,
		},
		session: {
			type: Sequelize.JSON,
			allowNull: false,
		},
		expires: {
			type: Sequelize.DATE,
			allowNull: false,
		},
	});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sessions');
  },
};
