'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("sessions", "session_id", "sid")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("sessions", "sid", "session_id")
  }
};
