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

const {
  SLACK_TOKEN,
  SLACK_ADMIN,
  SLACK_AVAILABLE_DEVS_CHANNEL_ID,
  SLACK_RACK_CITY_CHANNEL_ID,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_REDIRECT_URL,
  EMAIL_USER,
  OPS_EMAIL,
  IT_EMAIL,
  SUPPORT_EMAIL,
  ANDELA_ALLOCATIONS_API_TOKEN,
  NOKO_ADMIN_TOKEN,
  ANDELA_PARTNERS,
  ALLOCATION_PLACEMENTS,
  DB_TEST_URL,
  DB_STAGING_URL,
  DB_PROD_URL,
  DB_USER_NAME,
  DB_PASSWORD,
  DB_DEV_NAME,
  DB_HOST,
  DB_PORT,
  REACT_APP_ACTIVITY_FEED_NUMBER,
  JWT_KEY,
  TIMER_INTERVAL,
  FETCH_FAIL_AUTOMATION_COUNT,
  UPDATE_PARTNER_INTERVAL,
  NODE_ENV,
  PORT,
  SCAN_RANGE,
  REDIS_HOST,
  REDIS_PORT,
  USER_ROLE,
} = process.env;

const envVariables = {
  SLACK_TOKEN,
  SLACK_ADMIN,
  SLACK_AVAILABLE_DEVS_CHANNEL_ID,
  SLACK_RACK_CITY_CHANNEL_ID,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_REDIRECT_URL,
  EMAIL_USER,
  OPS_EMAIL,
  IT_EMAIL,
  SUPPORT_EMAIL,
  ANDELA_ALLOCATIONS_API_TOKEN,
  NOKO_ADMIN_TOKEN,
  ANDELA_PARTNERS,
  ALLOCATION_PLACEMENTS,
  DB_TEST_URL,
  DB_STAGING_URL,
  DB_PROD_URL,
  DB_USER_NAME,
  DB_PASSWORD,
  DB_DEV_NAME,
  DB_HOST,
  DB_PORT,
  REACT_APP_ACTIVITY_FEED_NUMBER,
  JWT_KEY,
  TIMER_INTERVAL,
  FETCH_FAIL_AUTOMATION_COUNT,
  UPDATE_PARTNER_INTERVAL,
  NODE_ENV,
  PORT,
  SCAN_RANGE,
  REDIS_HOST,
  REDIS_PORT,
  USER_ROLE,
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
