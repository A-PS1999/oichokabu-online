'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
	return queryInterface.renameColumn("sessions", "session", "sess")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("sessions", "sess", "session")
  }
};
