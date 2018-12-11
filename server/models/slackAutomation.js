import { automationStatus } from './emailAutomation';

export default (sequelize, DataTypes) => {
  const SlackAutomation = sequelize.define('SlackAutomation', Object.assign(
    automationStatus(DataTypes),
    {
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
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
