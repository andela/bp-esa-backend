const requiredString = DataTypes => ({
  type: DataTypes.STRING,
  allowNull: false,
});
export default (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partners',
    {
      id: { unique: true, ...requiredString(DataTypes), primaryKey: true },
      freckleProjectId: DataTypes.STRING,
      name: requiredString(DataTypes),
      location: requiredString(DataTypes),
      channelId: requiredString(DataTypes),
      channelName: requiredString(DataTypes),
    },
    {
      setterMethods: {
        channel_id(value) {
          this.setDataValue('channelId', value);
        },
        channel_name(value) {
          this.setDataValue('channelName', value);
        },
      },
    },
  );
  Partner.associate = (models) => {
    Partner.hasMany(models.Automation, { foreignKey: 'partnerId', as: 'automations' });
  };
  return Partner;
};
