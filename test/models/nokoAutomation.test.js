import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';
import nokoAutomation from '../../server/models/nokoAutomation';
import automation from '../../server/models/automation';
import { automationRelationships } from '../../server/helpers/modelHelpers';

describe('server/models/nokoAutomation', () => {
  const FlackAutomation = nokoAutomation(sequelize, dataTypes);
  const nokoAutomationInstance = new FlackAutomation();

  context('model name', () => {
    checkModelName(FlackAutomation)('nokoAutomation');
  });

  context('model properties', () => {
    ['nokoUserId', 'projectId', 'status', 'statusMessage', 'type'].forEach(
      checkPropertyExists(nokoAutomationInstance),
    );
  });

  context('model associations', () => {
    before(() => {
      FlackAutomation.associate({ Automation: automation });
    });

    it('defines a belongsTo association with Automation', () => {
      expect(FlackAutomation.belongsTo).to.have.been.calledWith(
        automation, automationRelationships,
      );
    });
  });
});
