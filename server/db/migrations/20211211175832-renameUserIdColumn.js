'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("ok_users", "user_id", "id")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("ok_users", "id", "user_id")
  }
};
