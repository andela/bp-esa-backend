/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable  no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import fs from 'fs';
import ms from 'ms';
import sendPlacementFetchEmail from './helpers';
import { fetchNewPlacements } from '../modules/allocations';
import { createAutomation } from '../modules/automations';

import client from '../helpers/redis';

const receiverEmail = process.env.SUPPORT_EMAIL;

let number = 1;
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
 * @function increaseFailCount
 * @desc Increases fail count when fetching allocations data fails
 * @returns {Promise} Promise to fetch new placements and execute automations
 */
const increaseFailCount = () => {
  // eslint-disable-next-line radix
  number += 1;
};

/**
 * @function checkFailureCount
 * @desc Checks failure count then calls the failure email
 * @returns {Promise} Promise to fetch new placements and execute automations
 */
const checkFailureCount = () => {
  // eslint-disable-next-line radix
  if (number >= parseInt(process.env.RESTART_TIME)) {
    sendPlacementFetchEmail(receiverEmail);
  }
};

/**
 * @desc Executes jobs to automate developer offboarding/onboarding tasks
 *
 * @param {string} type Type of job to execute: offboarding || onboarding
 *
 * @returns {Promise} Promise to fetch new placements and execute automations
 */
export default function executeJobs(type) {
  checkFailureCount();
  const { jobList, placementStatus, automationResult } = jobs[type];
  let fetchPlacementError;
  return fetchNewPlacements(placementStatus, 1)
    .catch(() => {
      fetchPlacementError = 'error';
      setTimeout(() => executeJobs(type), ms('5m'));
    }).then(async (newPlacements) => {
      if (!fetchPlacementError) {
        for (const placement of newPlacements) {
          const {
            fellow: { id: fellowId, name: fellowName },
            client_name: partnerName, client_id: partnerId,
          } = placement;
          const { id: automationId } = await createAutomation({
            fellowId, fellowName, partnerName, partnerId, type,
          });
          process.env.AUTOMATION_ID = automationId;
          await Promise.all(jobList.map(job => job(placement, automationResult)));
          client.incr('numberOfJobs');
        }
      } else {
        increaseFailCount();
      }
    });
}
