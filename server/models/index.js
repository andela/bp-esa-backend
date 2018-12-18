import Sequelize from 'sequelize';
import configObject from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config = configObject[env];

let sequelize;

if (env !== 'development') {
  sequelize = new Sequelize(config.url, {
    logging: () => {},
    define: {
      freezeTableName: true,
    },
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
      define: {
        freezeTableName: true,
      },
    },
  );
}


const db = {
  Partner: sequelize.import('./partner'),
  Automation: sequelize.import('./automation'),
  FreckleAutomation: sequelize.import('./freckleAutomation'),
  SlackAutomation: sequelize.import('./slackAutomation'),
  EmailAutomation: sequelize.import('./emailAutomation'),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    db[modelName].upsertById = (values) => {
      if (values.id) {
        return db[modelName]
          .update(values, { where: { id: values.id }, returning: true })
          .then((res) => {
            if (res[0] !== 1) {
              throw new Error('upsert should just update 1 row');
            }
            return [res[1][0], false];
          });
      }
      return db[modelName].create(values).then(res => [res, true]);
    };
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
