export default (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partners',
    {
      freckleProjectId: DataTypes.STRING,
      name: DataTypes.STRING,
      partnerId: { type: DataTypes.STRING, allowNull: false, unique: true },
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
