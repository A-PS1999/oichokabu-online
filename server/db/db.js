const { Sequelize } = require('sequelize');

const dbConnection = new Sequelize(
	process.env.DATABASE_URL, {
		logging: false
	}
);

module.exports = dbConnection;