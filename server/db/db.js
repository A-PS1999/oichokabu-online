const { Sequelize } = require('sequelize');

const useDatabaseSsl = process.env.DATABASE_SSL === 'true'
	|| (process.env.DATABASE_SSL !== 'false' && process.env.NODE_ENV === 'production');

const dbConnection = new Sequelize(
	process.env.DATABASE_URL, {
		logging: false,
		...(useDatabaseSsl && {
			dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
		}),
	}
);

module.exports = dbConnection;
