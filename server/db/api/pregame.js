const getPlayers = db => game_id =>
	db.ok_games.findbyPk(game_id, {
		include: [
			{
				model: db.ok_players,
				as: 'Players',
				attributes: ['host'],
				include: [
					{
						model: db.ok_users,
						as: 'User',
						attributes: ['user_id', 'username'],
					},
				],
			},
		],
	});
	
const getPlayerStatuses = db => player_gameid =>
	db.ok_users.findAll({
		attributes: ['user_id', 'username'],
		include: [
			{
				model: db.ok_players,
				as: 'Players',
				attributes: ['ready', 'host'],
				where: { player_gameid },
			},
		],
	});
	
const joinGame = db => (player_gameid, player_userid) =>
	db.ok_games.findByPk(player_gameid).then(game =>
		game.getPlayers().then(players => {
			if (game.player_cap > players.length) {
				return db.ok_players.create({
					player_gameid,
					player_userid,
				});
			} else {
				return Promise.reject(new Error('This game is full.'));
			}
		}),
	);
	
const exitGame = db => (player_gameid, player_userid) =>
	db.ok_players.findOne({
		where: {
			player_gameid,
			player_userid,
		},
	}).then(player => {
		if (player.host) {
			return db.ok_players.destroy({
				where: {
					player_gameid
				}
			}).then(_ => db.ok_games.destroy({ where: { game_id: player_gameid } }));
		} else {
			return db.ok_players.destroy({ where: { player_gameid, player_userid } });
		}
	});
	
const setGameStarted = db => game_id => db.ok_games.update({ status: 'started' }, { where: { game_id } });

const setGameReady = db => id =>
	db.ok_games.findOne({ where: { id } }).then(game =>
		game.getPlayers().then(players => {
			if (players.length < game.player_cap) {
				return {
					ready: false,
					status: 'Not enough players'
				};
			}
			let readyPlayers = 0;
			for (let i = 0; i < readyPlayers; i++) {
				if (players[i].ready) {
					readyPlayers++;
				}
			}
			if (game.player_cap === readyPlayers) {
				return {
					ready: true,
					status: 'The game is ready to begin',
				};
			} else {
				return {
					ready: false,
					status: 'Not all players are ready',
				};
			}
		}),
	);
	
const accessPlayerReady = db => (player_gameid, player_userid) =>
	db.ok_players.findOne({
		attributes: ['ready'],
		where: {
			player_gameid,
			player_userid
		},
	});
	
const togglePlayerReady = db => (player_gameid, player_userid) =>
	accessPlayerReady(player_gameid, player_userid).then(result =>
		db.ok_players.update(
		{ ready: !result.ready },
		{
			where: {
				player_gameid,
				player_userid,
			},
			returning: true
		},
		),
	);
	
module.exports = db => ({
	getPlayers: getPlayers(db),
	getPlayerStatuses: getPlayerStatuses(db),
	joinGame: joinGame(db),
	exitGame: exitGame(db),
	setGameStarted: setGameStarted(db),
	setGameReady: setGameReady(db),
	accessPlayerReady: accessPlayerReady(db),
	togglePlayerReady: togglePlayerReady(db),
});