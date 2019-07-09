import { object, string, mixed } from 'yup';

const channelDetails = object()
  .noUnknown()
  .shape({
    channelId: string(),
    channelName: string(),
    channelProvision: mixed().oneOf(['create', 'retrieve']),
  });
export const slackChannelSchema = object()
  .noUnknown()
  .shape({
    general: channelDetails,
    internal: channelDetails,
  });

export default (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partners',
    {
      freckleProjectId: DataTypes.STRING,
      name: DataTypes.STRING,
      partnerId: { type: DataTypes.STRING, allowNull: false, unique: true },
      slackChannels: {
        type: DataTypes.JSON,
        validate: {
          isValidFormat(value) {
            slackChannelSchema.validateSync(value, {
              abortEarly: false,
              strict: true,
            });
          },
        },
      },
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
