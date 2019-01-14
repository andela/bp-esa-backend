import { baseAutomationFields, automationRelationships } from '../helpers/modelHelpers';

export default (sequelize, DataTypes) => {
  const EmailAutomation = sequelize.define(
    'emailAutomation',
    Object.assign(baseAutomationFields(DataTypes), {
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
    }),
  );

  EmailAutomation.associate = (models) => {
    EmailAutomation.belongsTo(models.Automation, automationRelationships);
  };
  return EmailAutomation;
};
