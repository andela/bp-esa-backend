import { baseAutomationFields, automationRelationships } from '../helpers/modelHelpers';

export default (sequelize, DataTypes) => {
  const FreckleAutomation = sequelize.define(
    'freckleAutomation',
    Object.assign(baseAutomationFields(DataTypes), {
      freckleUserId: DataTypes.STRING,
      projectId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['projectCreation', 'projectAssignment'],
        allowNull: false,
      },
    }),
  );

  FreckleAutomation.associate = (models) => {
    FreckleAutomation.belongsTo(models.Automation, automationRelationships);
  };

  return FreckleAutomation;
};
