module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('partners', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    freckleProjectId: DataTypes.STRING,
    name: DataTypes.STRING,
    partnerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slackChannels: DataTypes.JSON,
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

  down: (queryInterface, DataTypes) => queryInterface.dropTable('partners'),
};
