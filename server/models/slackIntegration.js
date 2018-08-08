export default (sequelize, DataTypes) => {
  const SlackIntegration = sequelize.define('slack_integrations', {
    slack_channel: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    is_addition: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.STRING,
    },
  });

  SlackIntegration.associate = (models) => {
    SlackIntegration.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });

    SlackIntegration.belongsTo(models.Partner, {
      foreignKey: {
        name: 'partnerId',
        field: 'partner_id',
      },
    });
  };

  return SlackIntegration;
};
