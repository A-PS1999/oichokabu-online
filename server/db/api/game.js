const getUserIdsAndUsernames = db => game_id =>
	db.ok_games.findByPk(game_id).then(game =>
		game.getUsers({ attributes: ['user_id', 'username'] })
	);

const removePlayer = db => (player_gameid, player_userid) =>
	db.ok_games.findByPk(player_gameid)
	.then(game => game.decrement('player_cap'))
	.then(_ => db.players.destroy({ where: { player_gameid, player_userid } }));
	
const runGame = db => game_id =>
	db.ok_games.findByPk(game_id).then(game => {
		if ('started' !== game.status) {
			return Promise.reject(new Error(`Cannot run game ${game_id} due to status ${game.status}`));
		} else {
			return db.ok_games.update({ status: 'running' }, { where: { game_id } });
		}
	});
	
const endGame = db => game_id =>
	db.ok_games.update({ status: 'ended' }, { where: { game_id } });
	
const getStatus = db => game_id =>
	db.ok_games.findByPk(game_id).then(game => game.status);
	
module.exports = db => ({
	getUserIdsAndUsernames: getUserIdsAndUsernames(db),
	removePlayer: removePlayer(db),
	runGame: runGame(db),
	endGame: endGame(db),
	getStatus: getStatus(db),
});