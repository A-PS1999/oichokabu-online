const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });

module.exports = {
	development: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		logging: false,
	},
	test: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		logging: false,
	},
	production: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		logging: false,
	},
}