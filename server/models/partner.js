export default (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partners',
    {
      freckleProjectId: DataTypes.STRING,
      name: DataTypes.STRING,
      partnerId: DataTypes.STRING,
      slackChannels: DataTypes.JSON,
    },
    {
      setterMethods: {
        id(value) {
          this.setDataValue('partnerId', value);
        },
      },
    },
  );
  return Partner;
};
