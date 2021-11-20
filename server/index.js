if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const path = require('path');
const express = require('express');
const app = express();
const db = require('./db');
const session = require('./db/session');
const { passport } = require('./passport');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => 	
	console.log(`Listening on port ${PORT}`)
);

const io = require('socket.io')(server);
require('./sockets')(io);

db.sync().then(() => console.log("Database synced"));

// get cards as static images
app.use(express.static(path.join(__dirname, '..', 'public/cards')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes'));

app.get('*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// 404 error catcher
app.use( function(req, res, next) {
	res.status(404).send("Unable to find requested resource");
});

// handler for other errors
app.use((err, req, res, next) => {
	if (err) {
		req.logout();
		next();
	}
	console.error(err.stack);
	res.status(err.status || 500).send(err.message);
});

module.exports = app;