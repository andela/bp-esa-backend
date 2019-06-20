module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('partners', 'location', {
    allowNull: false,
    type: DataTypes.STRING,
  }),

  down: (queryInterface, DataTypes) => queryInterface.removeColumn('partners', 'location'),
};
