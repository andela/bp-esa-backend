module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.changeColumn('automation', 'partnerId', {
    type: DataTypes.STRING,
    allowNull: true,
    onDelete: 'SET NULL',
    references: {
      model: 'partners',
      key: 'id',
      as: 'partnerId',
    },
  }),

  down: (queryInterface, DataTypes) => queryInterface.changeColumn('automation', 'partnerId', {
    type: DataTypes.STRING,
    allowNull: false,
  }),
};
