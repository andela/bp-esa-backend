import env, { validateEnvironmentVars } from '../../server/validator';

require('dotenv').config();

describe('Test validation for present environment variables', () => {
  it('Ensure that an error is thrown when there is a missing env variable', () => {
    const requiredEnvVariables = {
      UNEXISTIN_VARIABLE: undefined,
      UN_DEFINED_VARIABLE_TWO: process.env.UN_DEFINED_VARIABLE_TWO,
    };
    expect(() => {
      validateEnvironmentVars(requiredEnvVariables);
    }).throw(
      `There are 2 environment variables missing:
    \n\nUNEXISTIN_VARIABLE\nUN_DEFINED_VARIABLE_TWO\n`,
    );
  });
  it('should return the environment variable object after validation', () => {
    const envVariables = {
      SOME_VARIABLE: 'esa',
      NODE_ENV: process.env.NODE_ENV,
    };
    const envObject = validateEnvironmentVars(envVariables);
    expect(envObject).to.equal(envVariables);
    expect(envObject.NODE_ENV).to.equal(process.env.NODE_ENV);
    expect(envObject.NODE_ENV).to.equal('test');
    expect(envObject.NODE_ENV).to.equal(env.NODE_ENV);
  });
});
