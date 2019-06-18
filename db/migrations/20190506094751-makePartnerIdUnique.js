module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.changeColumn('partners', 'partnerId', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }),

  down: (queryInterface, DataTypes) => queryInterface.changeColumn('partners', 'partnerId', DataTypes.STRING),
};
