module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('slackAutomation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['success', 'failure'],
      allowNull: false,
    },
    statusMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    slackUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['creation', 'removal', 'addition'],
      allowNull: false,
    },
    automationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'automation',
        key: 'id',
      },
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

  down: queryInterface => queryInterface.dropTable('slackAutomation'),
};
