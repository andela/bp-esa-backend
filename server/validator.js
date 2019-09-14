import { object, string, mixed } from 'yup';
import dotenv from 'dotenv';

dotenv.config();
const channelDetails = channelType => object()
  .noUnknown()
  .shape({
    channelId: string().required(`${channelType}.channelId is a required field`),
    channelName: string().required(`${channelType}.channelName is a required field`),
    channelProvision: mixed()
      .oneOf(
        ['retrieve'],
        `${channelType}.channelProvision should be retrieve`,
      )
      .default('retrieve'),
  })
  .required(`${channelType} channel object is required`);

const slackChannelSchema = object()
  .noUnknown()
  .shape({
    general: channelDetails('general'),
    internal: channelDetails('internal'),
  })
  .required('slackChannels object is required');

const validIdConditions = id => [id.trim().startsWith('-'), id.trim().length === 20];
export const validatePartner = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  if (!validIdConditions(id).every(item => item)) {
    return res.status(400).json({ message: 'Partner ID is invalid' });
  }
  return slackChannelSchema
    .validate(body.slackChannels, {
      abortEarly: false,
      strict: true,
    })
    .then(() => next())
    .catch(err => res.status(400).json({ errors: err.errors, message: err.name }));
};

const envVariables = {
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  SLACK_ADMIN: process.env.SLACK_TOKEN,
  SLACK_AVAILABLE_DEVS_CHANNEL_ID: process.env.SLACK_AVAILABLE_DEVS_CHANNEL_ID,
  SLACK_RACK_CITY_CHANNEL_ID: process.env.SLACK_RACK_CITY_CHANNEL_ID,
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
  GMAIL_REDIRECT_URL: process.env.GMAIL_REDIRECT_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  OPS_EMAIL: process.env.OPS_EMAIL,
  IT_EMAIL: process.env.IT_EMAIL,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  ANDELA_ALLOCATIONS_API_TOKEN: process.env.ANDELA_ALLOCATIONS_API_TOKEN,
  NOKO_ADMIN_TOKEN: process.env.NOKO_ADMIN_TOKEN,
  ANDELA_PARTNERS: process.env.ANDELA_PARTNERS,
  ALLOCATION_PLACEMENTS: process.env.ALLOCATION_PLACEMENTS,
  DB_TEST_URL: process.env.DB_TEST_URL,
  DB_STAGING_URL: process.env.DB_STAGING_URL,
  DB_PROD_URL: process.env.DB_PROD_URL,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DEV_NAME: process.env.DB_DEV_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  REACT_APP_ACTIVITY_FEED_NUMBER: process.env.REACT_APP_ACTIVITY_FEED_NUMBER,
  JWT_KEY: process.env.JWT_KEY,
  TIMER_INTERVAL: process.env.TIMER_INTERVAL,
  FETCH_FAIL_AUTOMATION_COUNT: process.env.FETCH_FAIL_AUTOMATION_COUNT,
  UPDATE_PARTNER_INTERVAL: process.env.UPDATE_PARTNER_INTERVAL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SCAN_RANGE: process.env.SCAN_RANGE,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  USER_ROLE: process.env.USER_ROLE,
};

export const validateEnvironmentVars = (envObject) => {
  const missingVariable = Object.keys(envObject).filter(
    variable => envObject[variable] === undefined,
  );

  if (!missingVariable.length) return envObject;

  throw new Error(
    `There are ${missingVariable.length} environment variables missing:
    \n\n${missingVariable.join('\n')}\n`,
  );
};

export default validateEnvironmentVars(envVariables);
