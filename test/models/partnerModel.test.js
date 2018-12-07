import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import Partner from '../../server/models/partner';

const Model = Partner(sequelize, dataTypes);

describe('Partner model name and properties', () => {
  const PartnerInstance = new Model();
  checkModelName(Model)('partners');
  context('properties', () => {
    ['name', 'partnerId'].forEach(checkPropertyExists(PartnerInstance));
  });
});
