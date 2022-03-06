'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('ok_games', 'bet_max', {
      type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 500,
			validate: {
				min: 500,
				max: 1000000
			},
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('ok_games', 'bet_max')
  }
};
