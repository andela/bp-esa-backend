export default (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partners',
    {
      nokoProjectId: DataTypes.STRING,
      name: DataTypes.STRING,
      partnerId: { type: DataTypes.STRING, allowNull: false, unique: true },
      slackChannels: DataTypes.JSON,
      location: DataTypes.STRING,
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
