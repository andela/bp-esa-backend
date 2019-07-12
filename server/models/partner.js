import { object, string, mixed } from 'yup';

const channelDetails = channelType => object()
  .noUnknown()
  .shape({
    channelId: string().required(`${channelType}.channelId is a required field`),
    channelName: string().required(`${channelType}.channelName is a required field`),
    channelProvision: mixed()
      .oneOf(
        ['retrieve', 'create'],
        `${channelType}.channelProvision should be create || retrieve`,
      )
      .default('retrieve'),
  })
  .required(`${channelType} channel object is required`);

export const slackChannelSchema = object()
  .noUnknown()
  .shape({
    general: channelDetails('general'),
    internal: channelDetails('internal'),
  })
  .required('slackChannels object is required');

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
