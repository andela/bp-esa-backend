export default (sequelize, DataTypes) => {
  const Automation = sequelize.define('automation', {
    placementId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fellowName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fellowId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['onboarding', 'offboarding'],
      allowNull: false,
    },
  });
  Automation.associate = (models) => {
    Automation.hasMany(models.SlackAutomation, {
      foreignKey: 'automationId',
      as: 'slackAutomations',
    });
    Automation.hasMany(models.FreckleAutomation, {
      foreignKey: 'automationId',
      as: 'freckleAutomations',
    });
    Automation.hasMany(models.EmailAutomation, {
      foreignKey: 'automationId',
      as: 'emailAutomations',
    });
  };
  return Automation;
};
