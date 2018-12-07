export default (sequelize, DataTypes) => {
  const Partner = sequelize.define('partners', {
    freckleProjectId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    partnerId: {
      type: DataTypes.STRING,
    },
    slackChannels: {
      type: DataTypes.JSON,
    },
  });
  return Partner;
};
