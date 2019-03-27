import axios from 'axios';
import dotenv from 'dotenv';
import ms from 'ms';
import models from '../models';

dotenv.config();

// Axios authorization header setup
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

const validStatus = [
  'Active Partner',
  'Inactive Partner',
  'Onboarding Partner',
  'Onboarding and Active Partner',
];

// Updates the local redis store with latest Partner List
export const updatePartnerStore = (partnerId) => {
  if (partnerId) {
    return axios
      .get(`${process.env.ANDELA_PARTNERS}/${partnerId}`)
      .then(async response => models.Partner.create(response.data));
  }
  return axios.get(`${process.env.ANDELA_PARTNERS}?status=${validStatus}`).then(async (response) => {
    await models.Partner.destroy({ where: {} });
    return models.Partner.bulkCreate(response.data.values);
  });
};
/**
 * @desc Get partner details from radis db or fetch new partner data
 *
 * @param {string} partnerId ID of the partner
 *
 * @returns {object} Data of the partner
 */
export async function findPartnerById(partnerId) {
  let partner = await models.Partner.findByPk(partnerId);
  if (!partner) {
    partner = await updatePartnerStore(partnerId);
    if (!partner) throw new Error('Partner record was not found');
  }
  return partner;
}

/**
 * @desc Fetches new placements by status, from the last TIME_INTERVAL
 *
 * @param {string} status The status of placements to fetch from allocations
 *
 * @returns {Promise} Promise to return list of placements
 */
export const fetchNewPlacements = async (status) => {
  const fromDate = new Date(Date.now() - ms(process.env.TIMER_INTERVAL));
  const { data } = await axios.get(
    `${process.env.ALLOCATION_PLACEMENTS}?status=${status}&created_at=${fromDate}`,
  );
  return data.values;
};
