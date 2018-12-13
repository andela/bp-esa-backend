import {
  sequelize, dataTypes, checkModelName, checkPropertyExists,
} from 'sequelize-test-helpers';
import freckleAutomation from '../../server/models/freckleAutomation';
import automation from '../../server/models/automation';

describe('server/models/freckleAutomation', () => {
  const FlackAutomation = freckleAutomation(sequelize, dataTypes);
  const freckleAutomationInstance = new FlackAutomation();

  context('model name', () => {
    checkModelName(FlackAutomation)('freckleAutomation');
  });

  context('model properties', () => {
    ['freckleUserId', 'projectId', 'status', 'statusMessage', 'type'].forEach(
      checkPropertyExists(freckleAutomationInstance),
    );
  });

  context('model associations', () => {
    before(() => {
      FlackAutomation.associate({ Automation: automation });
    });

    it('defines a belongsTo association with Automation', () => {
      expect(FlackAutomation.belongsTo).to.have.been.calledWith(automation, {
        foreignKey: {
          name: 'automationId',
        },
      });
    });
  });
});
