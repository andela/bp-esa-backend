import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import FreckleIntegration from '../../server/models/freckleIntegration';
import User from '../../server/models/user';
import Partner from '../../server/models/partner';

const Model = FreckleIntegration(sequelize, dataTypes);

describe('FreckleIntegration model name and properties', () => {
  const FreckleIntegrationInstance = new Model();
  checkModelName(Model)('freckle_integrations');
  context('properties', () => {
    ['partner_tag', 'date', 'status'].forEach(checkPropertyExists(FreckleIntegrationInstance));
  });
});

describe('Associations', () => {
  before(() => {
    Model.associate({ User, Partner });
  });

  it('it belongsTo user and partner models', () => {
    expect(Model.belongsTo).to.have.been.calledWith(User);
    expect(Model.belongsTo).to.have.been.calledWith(Partner);
  });
});
