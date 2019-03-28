module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('automation', 'email', {
    allowNull: true,
    unique: false,
    type: DataTypes.STRING,
  }),

  down: (queryInterface, DataTypes) => queryInterface.removeColumn('automation', 'email'),
};
