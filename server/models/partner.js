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
    Partner.hasMany(models.EmaiIntegration);
    Partner.hasMany(models.FreckleIntegrstion);
    Partner.hasMany(models.SlackIntegration);
  }

  return User;
}
