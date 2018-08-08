export default (sequelize, DataTypes) => {
  const Partner = sequelize.define('partners', {
    name: {
      type: DataTypes.STRING,
    },
    partnerID: {
      type: DataTypes.STRING,
    }
  });

  Partner.associate = (models) => {
    Partner.hasMany(models.EmailIntegration);
    Partner.hasMany(models.FreckleIntegration);
    Partner.hasMany(models.SlackIntegration);
  }

  return Partner;
}
