import { baseAutomationFields, automationRelationships } from '../helpers/modelHelpers';

export default (sequelize, DataTypes) => {
  const SlackAutomation = sequelize.define(
    'slackAutomation',
    Object.assign(baseAutomationFields(DataTypes), {
      channelId: DataTypes.STRING,
      channelName: DataTypes.STRING,
      slackUserId: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM,
        values: ['create', 'kick', 'invite', 'retrieve'],
        allowNull: false,
      },
    }),
  );

  SlackAutomation.associate = (models) => {
    SlackAutomation.belongsTo(models.Automation, automationRelationships);
  };

  return SlackAutomation;
};
