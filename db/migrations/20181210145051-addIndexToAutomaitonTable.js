module.exports = {
  up: queryInterface => queryInterface.addIndex('automation', ['id', 'fellowId', 'partnerId']),

  down: queryInterface => queryInterface.removeIndex('automaiton', ['id', 'fellowId', 'partnerId']),
};
