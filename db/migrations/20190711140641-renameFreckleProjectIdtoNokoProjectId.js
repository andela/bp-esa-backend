module.exports = {
  up: queryInterface =>
    queryInterface.renameColumn('partners', 'freckleProjectId', 'nokoProjectId'),

  down: queryInterface =>
    queryInterface.renameColumn('partners', 'nokoProjectId', 'freckleProjectId'),
};
