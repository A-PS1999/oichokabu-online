'use strict';

module.exports = (sequelize, Sequelize) => {
	const users = sequelize.define(
		'ok_users',
		{
			id: {
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
			user_chips: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 10000,
			}
		},
		{
			timestamps: false,
		},
	);
	users.associate = db => {
		users.hasMany(db.ok_players, {
			as: 'Players',
			foreignKey: 'player_userid',
		});
		users.belongsToMany(db.ok_games, {
			as: 'Games',
			through: db.ok_players,
			foreignKey: 'player_userid',
		});
	};
	
	return users;
};