import ExpressValidator from 'express-validator/check';
import { slackChannelSchema } from './models/partner';

const { check, validationResult } = ExpressValidator;

const getErrors = (req, next) => {
  const errors = validationResult(req)
    .array()
    .map(error => error.msg);
  if (!errors.length) {
    return next();
  }
  return errors;
};

export const handleValidation = async (req, res, next) => {
  const result = getErrors(req, next);
  return Array.isArray(result) ? res.status(400).json({ errors: result, status: 'error' }) : result;
};

export const validatePartner = [
  check('id')
    .trim()
    .isString()
    .withMessage('Partner ID is required')
    .custom(id => id.startsWith('-') && id.length === 20)
    .withMessage('Partner ID is invalid'),
  check('slackChannels')
    .isJSON()
    .withMessage('slackChannels should be a JSON object')
    .custom(slackChannels => slackChannelSchema.isValidSync(slackChannels, {
      abortEarly: false,
      strict: true,
    }))
    .withMessage('slackChannels object contain invalid field(s)'),
];

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
