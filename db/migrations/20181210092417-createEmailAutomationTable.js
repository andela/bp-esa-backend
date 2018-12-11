module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('emailAutomation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
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

  down: queryInterface => queryInterface.dropTable('emailAutomation'),
};
