import axios from 'axios';
import redis from 'redis';
import dotenv from 'dotenv';

import client from '../helpers/redis';

dotenv.config();

// axios base URL and Authorization header setup
axios.defaults.baseURL = process.env.ANDELA_API_BASE_URL;
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

// Updates the local redis store with latest Partner List
export const updatePartnerStore = () => axios.get('api/v1/partners').then((response) => {
  client.set('partners', JSON.stringify(response.data), redis.print);
});

const resolvePartner = (partnerId, result, resolve) => {
  if (result) {
    return resolve(JSON.parse(result).values.filter(partner => partner.id === partnerId)[0]);
  }
  return resolve(null);
};

/**
 * @desc Fetch partner data from external api
 *
 * @param {string} partnerId ID of the partner
 *
 * @returns {Promise} Promise of the partner data to be fetched
 */

const retrievePartner = partnerId => new Promise((resolve, reject) => {
  client.get('partners', (error, result) => {
    if (error) {
      reject(error);
    }
    return resolvePartner(partnerId, result, resolve);
  });
});

/**
 * @desc Get partner details from radis db or fetch new partner data
 *
 * @param {string} partnerId ID of the partner
 *
 * @returns {object} Data of the partner
 */
export async function findPartnerById(partnerId) {
  let partner = await retrievePartner(partnerId);
  if (!partner) {
    await updatePartnerStore();
    partner = await retrievePartner(partnerId);
    if (!partner) throw new Error('Partner record was not found');
  }
  return partner;
}

/**
 * @desc Fetches new placements based on status, from the past numberOfDays
 *
 * @param {string} status - The status of placements to fetch from allocations
 * @param {number} numberOfDays - The range of days from which to get new placements
 *
 * @returns {Promise} - Promise which resolves to a list of placements
 * from the past numberOfDays provided, or throws an error if unsuccessful
 */
export const fetchNewPlacements = async (status, numberOfDays = 1) => {
  const response = await axios.get(`api/v1/placement?status=${status}`);
  const placements = response.data.values;
  const currentDate = new Date(Date.now());
  const fromDate = currentDate.setDate(currentDate.getDate() - numberOfDays);
  return placements.filter(data => Date.parse(data.created_at) >= fromDate);
};
