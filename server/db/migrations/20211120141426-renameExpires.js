'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("sessions", "expires", "expire");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("sessions", "expire", "expires");
  }
};
