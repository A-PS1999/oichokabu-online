'use strict';

module.exports = (sequelize, Sequelize) => {
	return sequelize.define(
		'sessions',
		{
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
		},
		{
			timestamps: false,
		},
	);
};