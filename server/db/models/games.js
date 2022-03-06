'use strict';

module.exports = (sequelize, Sequelize) => {
	const games = sequelize.define(
	'ok_games',
	{
		game_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		status: {
			type: Sequelize.ENUM,
			values: ['open', 'started', 'running', 'ended'],
			allowNull: false,
		},
		room_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		player_cap: {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				min: 2,
				max: 5
			},
		},
		turn_max: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 12,
			validate: {
				min: 6,
				max: 24
			},
		},
		bet_max: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 500,
			validate: {
				min: 500,
				max: 1000000
			},
		},
		game_deck: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			allowNull: false,
			defaultValue: [],
		},
	},
	{
		timestamps: false,
	},
	);
	games.associate = db => {
		games.hasMany(db.ok_players, {
			as: 'Players',
			foreignKey: 'player_gameid'
		});
		games.belongsToMany(db.ok_users, {
			as: 'Users',
			through: db.ok_players,
			foreignKey: 'player_gameid',
		});
	};
	
	return games;
};