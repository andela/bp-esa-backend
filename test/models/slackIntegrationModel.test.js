import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import SlackIntegration from '../../server/models/slackIntegration';
import User from '../../server/models/user';
import Partner from '../../server/models/partner';

const Model = SlackIntegration(sequelize, dataTypes);

describe('SlackIntegration model name and properties', () => {
  const SlackIntegrationInstance = new Model();
  checkModelName(Model)('slack_integrations');
  context('properties', () => {
    ['slack_channel', 'date', 'is_addition', 'status'].forEach(
      checkPropertyExists(SlackIntegrationInstance),
    );
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
