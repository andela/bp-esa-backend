module.exports = {
  up: queryInterface => queryInterface.renameTable('freckleAutomation', 'nokoAutomation'),

  down: queryInterface => queryInterface.renameTable('nokoAutomation', 'freckleAutomation'),
};
