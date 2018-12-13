const validateEnvironmentVars = () => {
  const requiredEnvVariables = [
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
    'ANDELA_API_BASE_URL',
  ];
  const missingVariable = [];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      missingVariable.push(variable);
    }
  });
  if (missingVariable.length >= 1) {
    throw Error(`${missingVariable.length} environment variables are missing: ${missingVariable.join(', ')}`);
  }
};

export default validateEnvironmentVars;
