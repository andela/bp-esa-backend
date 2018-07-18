import Sequelize from 'sequelize'

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, {
      dialect: 'postgres',
      define: {
        underscored: true,
      }
    }
  );
}

const db = {
  User: sequelize.import('./user'),
  Partner: sequelize.import('./partner'),
  FreckleIntergration: sequelize.import('./freckleIntegration'),
  SlackIntegration: sequelize.import('./slackIntegration'),
  EmailIntegration: sequelize.import('./emailIntegration'),
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db
