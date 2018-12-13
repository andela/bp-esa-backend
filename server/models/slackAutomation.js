import { automationStatus } from './emailAutomation';

export default (sequelize, DataTypes) => {
  const SlackAutomation = sequelize.define('slackAutomation', Object.assign(
    automationStatus(DataTypes),
    {
      channelId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      channelName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slackUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['create', 'kick', 'invite'],
        allowNull: false,
      },
    },
  ));

  SlackAutomation.associate = (models) => {
    SlackAutomation.belongsTo(models.Automation, {
      foreignKey: {
        name: 'automationId',
      },
    });
  };

  return SlackAutomation;
};
