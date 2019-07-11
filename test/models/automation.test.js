import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';
import automation from '../../server/models/automation';
import slackAutomation from '../../server/models/slackAutomation';
import emailAutomation from '../../server/models/emailAutomation';
import nokoAutomation from '../../server/models/nokoAutomation';

describe('server/models/automation', () => {
  const AutomationModel = automation(sequelize, dataTypes);
  const automationInstance = new AutomationModel();

  context('model name', () => {
    checkModelName(AutomationModel)('automation');
  });

  context('model properties', () => {
    ['fellowName', 'fellowId', 'partnerName', 'partnerId', 'type'].forEach(
      checkPropertyExists(automationInstance),
    );
  });

  context('model associations', () => {
    before(() => {
      AutomationModel.associate({
        SlackAutomation: slackAutomation,
        EmailAutomation: emailAutomation,
        NokoAutomation: nokoAutomation,
      });
    });

    it('defines a one-to-many association with slackAutomaiton', () => {
      expect(AutomationModel.hasMany).to.have.been.calledWith(slackAutomation);
      expect(AutomationModel.hasMany).to.have.been.calledWith(emailAutomation);
      expect(AutomationModel.hasMany).to.have.been.calledWith(nokoAutomation);
    });
  });
});
