import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';
import emailAutomation from '../../server/models/emailAutomation';
import automation from '../../server/models/automation';
import { automationRelationships } from '../../server/helpers/modelHelpers';

describe('server/models/emailAutomation', () => {
  const EmailAutomation = emailAutomation(sequelize, dataTypes);
  const emailAutomationInstance = new EmailAutomation();

  context('model name', () => {
    checkModelName(EmailAutomation)('emailAutomation');
  });

  context('model properties', () => {
    ['status', 'statusMessage', 'recipient', 'sender', 'subject'].forEach(
      checkPropertyExists(emailAutomationInstance),
    );
  });

  context('model associations', () => {
    before(() => {
      EmailAutomation.associate({ Automation: automation });
    });

    it('defines a belongsTo association with Automation', () => {
      expect(EmailAutomation.belongsTo).to.have.been.calledWith(
        automation, automationRelationships,
      );
    });
  });
});
