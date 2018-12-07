const dotenv = require('dotenv');

dotenv.config();

const baseConfig = {
  dialect: 'postgres',
};

module.exports = {
  development: Object.assign(baseConfig, {
    url: process.env.DB_DEV_URL,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEV_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  }),
  test: Object.assign(baseConfig, {
    url: process.env.DB_TEST_URL,
  }),
  staging: Object.assign(baseConfig, {
    url: process.env.DB_STAGING_URL,
  }),
  production: Object.assign(baseConfig, {
    url: process.env.DB_PROD_URL,
  }),
};
