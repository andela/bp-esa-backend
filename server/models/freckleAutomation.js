import { automationStatus } from './emailAutomation';

export default (sequelize, DataTypes) => {
  const FreckleAutomation = sequelize.define('FreckleAutomation', Object.assign(
    automationStatus(DataTypes),
    {
      freckleUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectId: {
        type: DataTypes.STRING,
        allowNull: false,
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
      },
    });
  };

  return FreckleAutomation;
};
