module.exports = {
  up: queryInterface =>
    queryInterface.renameColumn('freckleAutomation', 'freckleUserId', 'nokoUserId'),

  down: queryInterface =>
    queryInterface.renameColumn('freckleAutomation', 'nokoUserId', 'freckleUserId'),
};
