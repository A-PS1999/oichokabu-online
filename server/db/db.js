require('dotenv').config();
const { Sequelize } = require('sequelize');

const pass = process.env.DB_PASS;

const db = new Sequelize(
	process.env.DATABASE_URL ||
	`postgres://sam:${pass}@localhost:5432/oichokabu-backend`, {
		logging: false
	}
);

module.exports = db;