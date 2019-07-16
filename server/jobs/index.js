/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs';
import ms from 'ms';
import * as Helper from './helpers';
import { fetchNewPlacements, findPartnerById } from '../modules/allocations';
import { io } from '..';
import { formatPayload } from '../utils/formatter';
import { include } from '../controllers/automationController';
import db from '../models';

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
  },
  onboarding: {
    jobList: getJobs('onboarding'),
    placementStatus: 'Placed - Awaiting Onboarding',
  },
};
/**
 * @desc Generates data for creating automation from placement
 *
 * @param {Object} placement Placement instance from allocations
 * @param {String} type Onboarding or Offboarding
 * @returns {Object} Useful data for creating automation
 */
export const automationData = (placement, type) => {
  const {
    id: placementId,
    fellow: { id: fellowId, name: fellowName, email },
    client_name: partnerName,
    client_id: partnerId,
  } = placement;
  return {
    fellowId,
    fellowName,
    partnerName,
    partnerId,
    type,
    email,
    placementId,
  };
};

/**
 * @desc Creates Automation model instances and executes automation (slack, email, noko)
 * process for each automation
 *
 * @param {Object} placement A placement instance
 * @param {Object} partner The partner involved in the engagement
 * @param {string} type Type of job to execute: offboarding || onboarding
 * @param {Array} jobList A list of automation functions to execute
 *
 * @returns {void} void
 */
const automations = async (placement, partner, type, jobList) => {
  const { placementId, ...defaults } = automationData(placement, type);
  const [{ id: automationId }, created] = await db.Automation.findOrCreate({
    where: { placementId },
    defaults,
  });
  if (created) {
    await Promise.all(jobList.map(job => job(placement, partner, automationId)));
    const newAutomation = await db.Automation.findByPk(automationId, { include });
    io.emit('newAutomation', formatPayload(newAutomation));
  }
};

const automationList = (partnerList, newPlacements, type, jobList) => {
  const partner = clientId => partnerList.find(({ partnerId }) => partnerId === clientId);
  return newPlacements.map(placement => automations(placement, partner(placement.client_id), type, jobList));
};

/**
 * @desc Executes jobs to automate developer offboarding/onboarding tasks
 *
 * @param {string} type Type of job to execute: offboarding || onboarding
 *
 * @returns {Promise} Promise to fetch new placements and execute automations
 */
export default function executeJobs(type) {
  Helper.checkFailureCount(Helper.count.FAILED_COUNT_NUMBER);
  const { jobList, placementStatus } = jobs[type];
  let fetchPlacementError;
  return fetchNewPlacements(placementStatus)
    .catch(() => {
      fetchPlacementError = 'error';
      setTimeout(() => executeJobs(type), ms('5m'));
      Helper.count.FAILED_COUNT_NUMBER += 1;
    })
    .then(async (newPlacements) => {
      if (!fetchPlacementError) {
        Helper.count.FAILED_COUNT_NUMBER = 0;
        const partnerList = await Promise.all(
          newPlacements.map(({ client_id: partnerId }) => findPartnerById(partnerId, type)),
        );
        await Promise.all(automationList(partnerList, newPlacements, type, jobList));
      }
    });
}
