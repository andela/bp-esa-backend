import { slackChannelSchema } from './models/partner';

const validIdConditions = id => [id, id.trim().startsWith('-'), id.trim().length === 20];
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
    .catch(err => res.status(400).json({ errors: err.errors, status: err.name }));
};

export const requiredEnvVariables = [
  'SLACK_TOKEN',
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REFRESH_TOKEN',
  'GMAIL_REDIRECT_URL',
  'EMAIL_USER',
  'OPS_EMAIL',
  'IT_EMAIL',
  'ANDELA_ALLOCATIONS_API_TOKEN',
  'FRECKLE_ADMIN_TOKEN',
  'SLACK_AVAILABLE_DEVS_CHANNEL_ID',
  'SLACK_RACK_CITY_CHANNEL_ID',
  'ANDELA_PARTNERS',
  'ALLOCATION_PLACEMENTS',
];

const validateEnvironmentVars = () => {
  const missingVariable = [];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) missingVariable.push(variable);
  });
  if (missingVariable.length) {
    const error = `${missingVariable.length} environment variables are missing: ${missingVariable}`;
    throw Error(error);
  }
};

export default validateEnvironmentVars;
