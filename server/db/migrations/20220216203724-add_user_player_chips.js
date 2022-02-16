'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('ok_users', 'user_chips', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10000,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('ok_users', 'user_chips');
  },
};
