module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      freckleProjectId: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      partnerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slackChannels: {
        type: DataTypes.JSON,
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
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('partners');
  }
};
