const replaceEnum = require('sequelize-replace-enum-postgres').default;

const tableUpdates = (queryInterface, automation, enumKey) => ({
  queryInterface,
  tableName: automation,
  columnName: 'status',
  newValues: enumKey ? ['success', 'failure', enumKey] : ['success', 'failure'],
  enumName: `enum_${automation}_status`,
});

module.exports = {
  up: queryInterface => Promise.all(
    ['freckleAutomation', 'slackAutomation', 'emailAutomation'].map(automation => replaceEnum(tableUpdates(queryInterface, automation, 'skipped'))),
  ),
  down: queryInterface => Promise.all(
    ['freckleAutomation', 'slackAutomation', 'emailAutomation'].map(automation => replaceEnum(tableUpdates(queryInterface, automation))),
  ),
};
