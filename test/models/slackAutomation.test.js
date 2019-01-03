import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';
import slackAutomation from '../../server/models/slackAutomation';
import automation from '../../server/models/automation';
import { automationRelationships } from '../../server/helpers/modelHelpers';

describe('server/models/slackAutomation', () => {
  const SlackAutomation = slackAutomation(sequelize, dataTypes);
  const slackAutomationInstance = new SlackAutomation();

  context('model name', () => {
    checkModelName(SlackAutomation)('slackAutomation');
  });

  context('model properties', () => {
    ['channelId', 'channelName', 'status', 'statusMessage', 'slackUserId', 'type'].forEach(
      checkPropertyExists(slackAutomationInstance),
    );
  });

  context('model associations', () => {
    before(() => {
      SlackAutomation.associate({ Automation: automation });
    });

    it('defines a belongsTo association with Automation', () => {
      expect(SlackAutomation.belongsTo).to.have.been.calledWith(automation, automationRelationships);
    });
  });
});
