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
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partnerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slackChannels: {
        type: DataTypes.JSON,
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
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('partners');
  }
};
