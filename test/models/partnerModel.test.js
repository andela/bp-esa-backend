import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import Partner from '../../server/models/partner';
import EmailIntegration from '../../server/models/emailIntegration';
import FreckleIntegration from '../../server/models/freckleIntegration';
import SlackIntegration from '../../server/models/slackIntegration';

const Model = Partner(sequelize, dataTypes);

describe('Partner model name and properties', () => {
  const PartnerInstance = new Model();
  checkModelName(Model)('partners');
  context('properties', () => {
    ['name', 'partnerID'].forEach(checkPropertyExists(PartnerInstance));
  });
});

describe('Associations', () => {
  before(() => {
    Model.associate({ EmailIntegration, FreckleIntegration, SlackIntegration });
  });

  it('it belongsTo user and partner models', () => {
    expect(Model.hasMany).to.have.been.calledWith(EmailIntegration);
    expect(Model.hasMany).to.have.been.calledWith(FreckleIntegration);
    expect(Model.hasMany).to.have.been.calledWith(SlackIntegration);
  });
});
