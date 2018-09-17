const dotenv = require('dotenv');

dotenv.config();

const baseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  jwtString: process.env.JWT_STRING,
};

module.exports = {
  development: Object.assign(baseConfig, {}),
  test: Object.assign(baseConfig, {
    database: process.env.DB_TEST_NAME,
  }),
  production: Object.assign(baseConfig, {}),
};
