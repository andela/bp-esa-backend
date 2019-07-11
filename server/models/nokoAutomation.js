import { baseAutomationFields, automationRelationships } from '../helpers/modelHelpers';

export default (sequelize, DataTypes) => {
  const NokoAutomation = sequelize.define(
    'nokoAutomation',
    Object.assign(baseAutomationFields(DataTypes), {
      nokoUserId: DataTypes.STRING,
      projectId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['projectCreation', 'projectAssignment'],
        allowNull: false,
      },
    }),
  );

  NokoAutomation.associate = (models) => {
    NokoAutomation.belongsTo(models.Automation, automationRelationships);
  };

  return NokoAutomation;
};
