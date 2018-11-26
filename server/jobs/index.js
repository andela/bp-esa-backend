/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs';

/**
 * @function getJobs
 * @param {string} folderName The folder containing the jobs.
 * @returns {array} An array of function representing jobs.
 */
const getJobs = (folderName) => {
  const jobs = fs
    .readdirSync(`${__dirname}/${folderName}`)
    .map((fileName) => {
      const { default: exported } = require(`${__dirname}/${folderName}/${fileName}`);
      return typeof (exported) === 'function' ? exported : () => {};
    });
  return jobs;
};

export const offboardingJobs = getJobs('offboarding');

export const onboardingJobs = getJobs('onboarding');
