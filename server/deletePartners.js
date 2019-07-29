import models from './models/index';

models.sequelize.query('DELETE FROM "partners"').then(([, metadata]) => {
  console.log('metadata>>>>>>>>', metadata);
});
