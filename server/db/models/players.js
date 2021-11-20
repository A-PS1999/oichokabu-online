'use strict';

module.exports = (sequelize, Sequelize) => {
	const players = sequelize.define(
		'ok_players',
		{
			player_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			player_userid: {
				type: Sequelize.INTEGER,
				references: { model: 'ok_users', key: 'user_id' },
			},
			player_gameid: {
				type: Sequelize.INTEGER,
				references: { model: 'ok_games', key: 'game_id' },
			},
			ready: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			host: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		},
	);
	players.associate = db => {
		players.belongsTo(db.ok_games, {
			as: 'game',
			foreignKey: 'player_gameid',
		});
		players.belongsTo(db.ok_users, {
			as: 'user',
			foreignKey: 'player_userid',
		});
	};
	
	return players;
};