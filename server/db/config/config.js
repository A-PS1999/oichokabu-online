const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const root = path.resolve(__dirname, '..', '..', '..');
const envFile = path.resolve(root, `.env.${env}`);
dotenv.config({ path: envFile });
dotenv.config({ path: path.resolve(root, '.env'), override: false });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'oichokabu',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgresql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || 'oichokabu_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgresql',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
}
