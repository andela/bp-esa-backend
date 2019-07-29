import models from './models/index';

(async () => {
  await models.Partner.destroy({ truncate: true, cascade: false });
})();
