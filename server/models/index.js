import Sequelize from 'sequelize';

import configObject from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config = configObject[env];

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, { });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: 'postgres',
    host: config.host || '127.0.0.1',
    define: {
      underscored: true,
    },
    logging: false,
  });
}

const db = {
  User: sequelize.import('./user'),
  Partner: sequelize.import('./partner'),
  FreckleIntegration: sequelize.import('./freckleIntegration'),
  SlackIntegration: sequelize.import('./slackIntegration'),
  EmailIntegration: sequelize.import('./emailIntegration'),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
