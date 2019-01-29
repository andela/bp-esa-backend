module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('automation', 'placementId', {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  }),

  down: (queryInterface, DataTypes) => queryInterface.removeColumn('automation', 'placementId'),
};
