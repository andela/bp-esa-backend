export default (sequelize, DataTypes) => {
  const Automation = sequelize.define('automation', {
    fellowName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fellowId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    Automation.hasMany(models.SlackAutomation);
    Automation.hasMany(models.FreckleAutomation);
    Automation.hasMany(models.EmailAutomation);
  };
  return Automation;
};
