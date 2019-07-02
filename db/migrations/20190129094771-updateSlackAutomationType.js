const replaceEnum = require('sequelize-replace-enum-postgres').default;

const tableUpdates = (queryInterface, enumKey) => ({
  queryInterface,
  tableName: 'slackAutomation',
  columnName: 'type',
  newValues: enumKey ? ['create', 'kick', 'invite', enumKey] : ['create', 'kick', 'invite'],
  enumName: 'enum_slackAutomation_type',
});

module.exports = {
  up: queryInterface => replaceEnum(tableUpdates(queryInterface, 'retrieve')),
  down: queryInterface => replaceEnum(tableUpdates(queryInterface)),
};
