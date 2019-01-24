import validateEnvironmentVars, { requiredEnvVariables } from '../../server/validator';

require('dotenv').config();

describe('Test validation for present environment variables', () => {
  it('Ensure that an error is thrown when there is a missing env variable', () => {
    try {
      requiredEnvVariables.push('UNEXISTIN_VARIABLE');
      validateEnvironmentVars();
    } catch (err) {
      const message = '1 environment variables are missing: UNEXISTIN_VARIABLE';
      expect(err.message).to.equal(message);
    }
  });
});
