export default (sequelize, DataTypes) => {
  const EmailIntegration = sequelize.define('email_integrations', {
    to_email: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
  });

  EmailIntegration.associate = (models) => {
    EmailIntegration.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });

    EmailIntegration.belongsTo(models.Partner, {
      foreignKey: {
        name: 'partnerId',
        field: 'partner_id',
      },
    });
  };

  return EmailIntegration;
};
