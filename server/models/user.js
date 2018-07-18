export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    }
  });

  User.associate = (models) => {
    User.hasMany(models.EmaiIntegration);
    User.hasMany(models.FreckleIntegrstion);
    User.hasMany(models.SlackIntegration);
  }

  return User;
}
