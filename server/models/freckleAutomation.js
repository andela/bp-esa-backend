import { automationStatus } from './emailAutomation';

export default (sequelize, DataTypes) => {
  const FreckleAutomation = sequelize.define('freckleAutomation', Object.assign(
    automationStatus(DataTypes),
    {
      freckleUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['projectCreation', 'projectAssignment'],
        allowNull: false,
      },
    },
  ));

  FreckleAutomation.associate = (models) => {
    FreckleAutomation.belongsTo(models.Automation, {
      foreignKey: {
        name: 'automationId',
        allowNull: false,
      },
    });
  };

  return FreckleAutomation;
};
