import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';

import EmailIntegration from '../../server/models/emailIntegration';
import User from '../../server/models/user';
import Partner from '../../server/models/partner';


const Model = EmailIntegration(sequelize, dataTypes);

describe('EmailIntegration model name and properties', () => {
  const EmailIntegrationInstance = new Model();
  checkModelName(Model)('email_integrations');
  context('properties', () => {
    ['to_email', 'subject', 'date', 'status'].forEach(
      checkPropertyExists(EmailIntegrationInstance),
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
