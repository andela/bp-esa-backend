import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import User from '../../server/models/user';
import EmailIntegration from '../../server/models/emailIntegration';
import FreckleIntegration from '../../server/models/freckleIntegration';
import SlackIntegration from '../../server/models/slackIntegration';

const Model = User(sequelize, dataTypes);

describe('User model name and properties', () => {
  const UserInstance = new Model();
  checkModelName(Model)('users');
  context('properties', () => {
    ['name', 'email'].forEach(checkPropertyExists(UserInstance));
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
