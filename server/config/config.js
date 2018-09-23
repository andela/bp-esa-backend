const dotenv = require('dotenv');

dotenv.config();

const baseConfig = {
  url: process.env.DB_URL,
  dialect: process.env.DB_DIALECT,
  jwtString: process.env.JWT_STRING,
};

module.exports = {
  development: Object.assign(baseConfig, {}),
  test: Object.assign(baseConfig, {
    database: process.env.DB_TEST_URL,
  }),
  production: Object.assign(baseConfig, {
    url: process.env.DB_URL,
  }),
};
