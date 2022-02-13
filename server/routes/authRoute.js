const router = require('express').Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const checkLoggedIn = require('./middleware/checkLoggedIn');
const checkNotLoggedIn = require('./middleware/checkNotLoggedIn');
const sendUserId = require('./middleware/sendUserId');

const { Auth } = require('../db/api');

router.get('/api/get-user-id', checkLoggedIn, sendUserId);

router.post('/api/get-session', async (request, response) => {
	if (request.session) {
		const userSessId = request.session.id;
		
		try {
			return Auth.findSessionById(userSessId)
			.then(result => {
				return response.json({ result });
			})
		} catch (error) {
			response.status(403).send({ error: new Error('No session found for that ID.') })
		}
	} else {
		return response.status(418).send({ message: "No session or ID available." })
	}
});

router.post('/api/register', async (request, response) => {
	const { username, email, password } = request.body;
	
	try {
		return Auth.addUser(username, email, password)
		.then(user => request.login(user, error => {
			if (error) {
				throw error;
			}
		
			const { password, ...auth } = user.dataValues;
			return response.json({ auth });
		}));
	} catch (error) {
		response.status(403).send({ error: new Error('Username or email already in use.') });
	}
});

router.post('/api/log-in', (request, response) => {
	const { username, password } = request.body;
	
	return Auth.findByUsername(username).then(user => {
		bcrypt.compare(password, user.password).then(isEqual => {
			if (isEqual) {
				return user;
			} else {
				return response.status(401).send({ error: new Error('Password is invalid') });
			}
		}).then(user => request.login(user, error => {
			if (error) {
				return error;
			}
			
			const { password, ...auth } = user.dataValues;
			return response.json({ auth });
		}))
	});
});

router.post('/api/log-out', (request, response) => {
	request.logout();
	request.session.destroy();
	response.sendStatus(200);
	return null;
});

router.post('/api/forgot-password', checkNotLoggedIn, (request, response) => {
	const { email } = request.body;
	const SALT = 10;

	return Auth.findByEmail(email)
		.then(user => {
			if (!user) {
				return response.sendStatus(401);
			}

			const { email, password } = user.dataValues;

			let today = new Date();
			let expire = new Date(today.getTime() + 24 * 60 * 60 * 1000);

			return bcrypt.hash(email + password + today, SALT, (error, hash) => {
				if (error) {
					throw error;
				}

				const sid = hash.replace('/', '-');
				const sess = { sid: sid, email: email };

				return Auth.addSession(sid, sess, expire)
					.then(session => {
						if (!session) {
							return response.sendStatus(401);
						}

						let passwordResetUrl;
						if (process.env.NODE_ENV === 'development') {
							passwordResetUrl = `http://localhost:3000/reset-password/${sid}`;
						} else {
							passwordResetUrl = `http://${request.headers.host}/reset-password/${sid}`;
						}

						const mailTransport = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: process.env.NODEMAILER_EMAIL,
								pass: process.env.NODEMAILER_PASS
							}
						});

						const mailData = {
							from: process.env.NODEMAILER_EMAIL,
							to: email,
							subject: "Reset your password",
							html: `Click <a href="${passwordResetUrl}">here</a> to reset your password`,
						};

						mailTransport.sendMail(mailData, (error, _) => {
							if (error) {
								throw error;
							}
							return response.sendStatus(204);
						});
					})
					.catch(error => {
						throw error;
					})
			})
		})
		.catch(error => response.status(500).send({ error }));
});

router.get("/api/reset-password/:sessionId", checkNotLoggedIn, (request, response) => {
	const { sessionId } = request.params;

	return Auth.findSessionById(sessionId)
		.then(session => {
			if (!session) {
				return response.sendStatus(401);
			}

			return response.sendStatus(200);
		})
		.catch(error => response.status(500).send({ error }))
});

router.post("/api/reset-password/:sessionId", checkNotLoggedIn, (request, response) => {
	const { password } = request.body;
	const { sessionId } = request.params;

	return Auth.findSessionById(sessionId)
		.then(session => {
			if (!session) {
				return response.sendStatus(401);
			}

			const { sid, sess, expire } = session.dataValues;
			const { email } = sess;
			const today = new Date();

			if (sid === sessionId && today < expire) {
				return Auth.removeSession(sid)
					.then(_ => {
						Auth.updatePassword(email, password)
							.then(user => {
								if (!user) {
									return response.sendStatus(401);
								}

								return response.sendStatus(201);
							})
							.catch(error => {
								throw error;
							})
					})
					.catch(error => {
						throw error;
					})
			}

			return session;
		})
		.catch(error => response.status(500).send({ error }))
});

module.exports = router;