'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ok_users', {
		user_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: {
				args: true,
				msg: "This username is already in use.",
			},
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: true,
			},
			unique: {
				args: true,
				msg: "This email address is already in use.",
			},
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ok_users');
  }
};
