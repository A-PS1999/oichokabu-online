'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('ok_users', {
		fields: ['username', 'email'],
		type: 'unique',
		name: 'unique_user_constraint'
	})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('ok_users', 'unique_user_constraint')
  }
};
