module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('freckleAutomation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    freckleUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectId: {
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
    type: {
      type: DataTypes.ENUM,
      values: ['projectCreation', 'projectAssignment'],
      allowNull: false,
    },
    automationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  down: queryInterface => queryInterface.dropTable('freckleAutomation'),
};
