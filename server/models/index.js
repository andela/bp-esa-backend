import Sequelize from 'sequelize';

import configObject from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config = configObject[env];

let sequelize;

if (env !== 'development') {
  sequelize = new Sequelize(config.url, {
    logging: () => {},
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.dialect,
    config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: () => {},
    },
  );
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
