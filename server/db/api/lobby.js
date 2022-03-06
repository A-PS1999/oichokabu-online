const findOngoingGames = db => () =>
	db.ok_games.findAll({
		where: {
			[db.Sequelize.Op.not] :[
				{
					status: 'ended',
				},
			],
		},
		include: {
			model: db.ok_players,
			as: 'Players',
			attributes: ['player_id', 'player_gameid']
		},
	});
	
const addGame = db => (player_userid, room_name, player_cap, turn_max, bet_max) =>
	db.ok_games.create({ room_name, player_cap, turn_max, bet_max, status: 'open' }).then(game =>
		Promise.resolve(
			db.ok_players.create({
				player_userid,
				player_gameid: game.game_id,
				ready: true,
				host: true,
			})
			.then(_ => Promise.resolve(game)),
		),
	);
	
module.exports = db => ({
	findOngoingGames: findOngoingGames(db),
	addGame: addGame(db),
});