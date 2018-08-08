export default (sequelize, DataTypes) => {
  const FreckleIntegration = sequelize.define('freckle_integrations', {
    partner_tag: {
      type: DataTypes.STRING,
      unique: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
  });

  FreckleIntegration.associate = (models) => {
    FreckleIntegration.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });

    FreckleIntegration.belongsTo(models.Partner, {
      foreignKey: {
        name: 'partnerId',
        field: 'partner_id',
      },
    });
  };

  return FreckleIntegration;
};
