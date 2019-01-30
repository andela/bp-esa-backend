import axios from 'axios';
import redis from 'redis';
import dotenv from 'dotenv';
import ms from 'ms';
import client from '../helpers/redis';

dotenv.config();

// Axios authorization header setup
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

// Updates the local redis store with latest Partner List
export const updatePartnerStore = () => axios.get(process.env.ANDELA_PARTNERS).then((response) => {
  client.set('partners', JSON.stringify(response.data), redis.print);
  return response.data;
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
    const { values } = await updatePartnerStore();
    [partner] = values.filter(data => data.id === partnerId);
    if (!partner) throw new Error('Partner record was not found');
  }
  return partner;
}

/**
 * @desc Fetches new placements by status, from the last TIME_INTERVAL
 *
 * @param {string} status The status of placements to fetch from allocations
 *
 * @returns {Array} List of placements from the last TIME_INTERVAL
 */
export const fetchNewPlacements = async (status) => {
  const { data } = await axios.get(`${process.env.ALLOCATION_PLACEMENTS}?status=${status}`);
  const fromDate = new Date(Date.now() - ms(process.env.TIMER_INTERVAL));
  return data.values.filter(placement => Date.parse(placement.created_at) > fromDate);
};
