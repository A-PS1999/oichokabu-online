const express_session = require('express-session');
const pgSession = require('connect-pg-simple')(express_session);

const mySecret = process.env.SESSION_SECRET;

const session = express_session({
	store: new pgSession({ tableName: 'sessions' }),
	secret: mySecret,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24 },
});

module.exports = session;