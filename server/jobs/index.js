/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable  no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import fs from 'fs';
import ms from 'ms';

import { fetchNewPlacements } from '../modules/allocations';
import client from '../helpers/redis';

/**
 * @function getJobs
 * @param {string} folderName The folder containing the jobs.
 * @returns {array} An array of function representing jobs.
 */
const getJobs = (folderName) => {
  const jobs = fs.readdirSync(`${__dirname}/${folderName}`).map((fileName) => {
    const { default: exported } = require(`${__dirname}/${folderName}/${fileName}`);
    return typeof exported === 'function' ? exported : () => {};
  });
  return jobs;
};

const jobs = {
  offboarding: {
    jobList: getJobs('offboarding'),
    placementStatus: 'External Engagements - Rolling Off',
    automationResult: {
      type: 'Offboarding',
    },
  },
  onboarding: {
    jobList: getJobs('onboarding'),
    placementStatus: 'Placed - Awaiting Onboarding',
    automationResult: {
      type: 'Onboarding',
    },
  },
};

/**
 * @desc Executes jobs to automate developer offboarding/onboarding tasks
 *
 * @param {string} type Type of job to execute: offboarding || onboarding
 *
 * @returns {Promise} Promise to fetch new placements and execute automations
 */
export default function executeJobs(type) {
  const { jobList, placementStatus, automationResult } = jobs[type];
  let fetchPlacementError;
  return fetchNewPlacements(placementStatus, 1)
    .catch(() => {
      fetchPlacementError = 'error';
      setTimeout(() => executeJobs(type), ms('5m'));
    })
    .then(async (newPlacements) => {
      if (!fetchPlacementError) {
        for (const placement of newPlacements) {
          const { fellow, client_name: clientName } = placement;
          await Promise.all(jobList.map(job => job(placement, automationResult)));

          automationResult.fellowName = fellow.name;
          automationResult.partnerName = clientName;
          automationResult.createdAt = new Date();

          client.incr('numberOfJobs');
          // save automationResult object to database
        }
      }
    });
}
