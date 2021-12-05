const router = require('express').Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { Auth } = require('../db/api');

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
				throw error;
			}
			
			const { password, ...auth } = user.dataValues;
			return response.json({ auth });
		}))
	});
});

router.post('/api/log-out', (request, response) => {
	request.logout();
	response.sendStatus(200);
	return null;
})

module.exports = router;