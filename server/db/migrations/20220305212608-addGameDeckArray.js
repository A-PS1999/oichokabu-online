'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('ok_games', 'game_deck', {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
      defaultValue: [],
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('ok_games', 'game_deck');
  }
};
