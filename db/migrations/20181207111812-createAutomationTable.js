module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('automation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    fellowName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fellowId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['onboarding', 'offboarding'],
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),

  down: queryInterface => queryInterface.dropTable('automation'),
};
