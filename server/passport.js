const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { Auth } = require('./db/api');

const checkPassword = function(user, password) {
	bcrypt.compare(password, user.password).then(isEqual => {
		if (isEqual) {
			return user;
		} else {
			return Promise.reject(new Error('Password is invalid'));
		}
	});
};

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => 
	Auth.findById(id)
	.then(user => done(null, user))
);

passport.use(new LocalStrategy(
	function(username, password, done) {
		Auth.findbyUsername(username)
		.then(user => {
			if (user) {
				return checkPassword(user, password)
				.then(user => done(null, user));
			} else {
				return done(null, false, { message: 'Username is incorrect' });
			}
		})
	}
));

const authRedirects = {
	successRedirect: '/lobby',
	failureRedirect: '/',
};

module.exports = {
	passport,
	authenticate: passport.authenticate('local', authRedirects),
};