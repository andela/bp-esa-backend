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
    User.hasMany(models.EmailIntegration);
    User.hasMany(models.FreckleIntegration);
    User.hasMany(models.SlackIntegration);
  }

  return User;
}
