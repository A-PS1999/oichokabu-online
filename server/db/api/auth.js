const bcrypt = require('bcrypt');
const BCRYPT_COST = 10;

const addUser = db => (username, email, to_hash) =>
	bcrypt.hash(to_hash, BCRYPT_COST).then(password =>
		db.ok_users.create({
			username,
			email,
			password,
		}),
	);
	
const findByUsername = db => username =>
	db.ok_users.findOne({ where: { username: username } });
	
const findByEmail = db => email => db.ok_users.findOne({ where: { email } });
	
const findById = db => id => db.ok_users.findOne({ where: { id } });

const updatePassword = db => (email, new_password) =>
	bcrypt.hash(new_password, BCRYPT_COST).then(hash => db.ok_users.update({ password: hash }, { where: { email } }));
	
const findPlayer = db => (player_gameid, player_userid) =>
	db.ok_players.findOne({
		where: {
			player_gameid,
			player_userid,
		},
	});
	
const addSession = db => (session_id, sess, expiry) =>
	db.sessions.create({
		session_id,
		sess,
		expiry,
	});
	
const removeSession = db => sid => db.sessions.destroy({ where: { sid } });

const findSessionById = db => sid => db.sessions.findOne({ where: { sid } });

module.exports = db => ({
	addUser: addUser(db),
	findByUsername: findByUsername(db),
	findByEmail: findByEmail(db),
	findById: findById(db),
	updatePassword: updatePassword(db),
	findPlayer: findPlayer(db),
	addSession: addSession(db),
	removeSession: removeSession(db),
	findSessionById: findSessionById(db),
});