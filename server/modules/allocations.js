import axios from 'axios';
import redis from 'redis';
import dotenv from 'dotenv';

import client from '../helpers/redis';

dotenv.config();

// axios base URL and Authorization header setup
axios.defaults.baseURL = 'https://api-prod.andela.com/';
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

// Updates the local redis store with latest Partner List
export const updatePartnerStore = async () => {
  axios
    .get('api/v1/partners')
    .then((response) => {
      client.set('partners', JSON.stringify(response.data), redis.print);
    })
    .catch(error => error.message)
    .finally(() => client.quit());
};

// Finds a partner using partnerId
export const findPartnerById = partnerId => new Promise((resolve, reject) => {
  client.get('partners', (error, result) => {
    client.quit();
    if (error) {
      reject(error);
    }
    resolve(JSON.parse(result).values.filter(partner => partner.id === partnerId)[0]);
  });
});

/**
 *@desc Fetches placements from allocations, based on the status specified
 *
 * @param {string} status - The status of placements to fetch
 *
 * @returns {Promise} - Promise of the returned placements from allocations
 */
const fetchPlacementsByStatus = status => axios.get(`api/v1/placements?status=${status}`);

/**
 * @desc Fetches new placements based on status, from the past numberOfDays
 *
 * @param {string} status - The status of placements to fetch from allocations
 * @param {number} numberOfDays - The range of days from which to get new placements
 *
 * @returns {Promise} - Promise which resolves to a list of placements
 * from the past numberOfDays provided, or throws an error if unsuccessful
 */
export const fetchNewPlacements = (status, numberOfDays = 1) => fetchPlacementsByStatus(status)
  .then((res) => {
    const placements = res.data.values;
    const currentDate = new Date(Date.now());
    const fromDate = currentDate.setDate(currentDate.getDate() - numberOfDays);
    return placements.filter(data => Date.parse(data.created_at) >= fromDate);
  });
