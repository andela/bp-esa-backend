import axios from 'axios';
import ms from 'ms';
import https from 'https';
import { redisdb } from '../helpers/redis';
import db from '../models';
import { findOrCreatePartnerChannel } from './slack/slackIntegration';
import { getPartnerRecord } from './automations';

require('dotenv').config();

// Axios authorization header setup
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

const getPartnerfromAPI = async (partnerId) => {
  const { data } = await axios.get(`${process.env.ANDELA_PARTNERS}/${partnerId}`, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });
  redisdb.set(data.id, JSON.stringify(data));
  return data;
};

// Updates the local redis store with latest Partner List
export const getPartnerFromStore = async (partnerId) => {
  try {
    const result = await redisdb.get(partnerId);
    return !result ? getPartnerfromAPI(partnerId) : JSON.parse(result);
  } catch ({ response, message }) {
    throw new Error(response ? response.data.error : message);
  }
};
const generateInternalChannel = (newPartner, jobType) => {
  if (!newPartner.channel_id.length) {
    return findOrCreatePartnerChannel(newPartner, 'internal', jobType);
  }
  return {};
};

/**
 * @desc Get partner details from radis db or fetch new partner data
 *
 * @param {string} partnerId ID of the partner
 * @param {string} jobType Type of job being executed: onboarding || offboarding
 *
 * @returns {object} Data of the partner
 */
export async function findPartnerById(partnerId, jobType) {
  const partner = await getPartnerRecord(partnerId);
  if (!partner) {
    const newPartner = await getPartnerFromStore(partnerId);
    if (!newPartner) throw new Error('Partner record was not found');
    const [genChannel = {}, intChannel = {}] = await Promise.all([
      findOrCreatePartnerChannel(newPartner, 'general', jobType),
      generateInternalChannel(newPartner, jobType),
    ]);
    newPartner.slackChannels = {
      general: genChannel.channelId,
      internal: intChannel.channelId || newPartner.channel_id,
    };
    const [{ dataValues }] = await db.Partner.upsert(newPartner, { returning: true });
    return dataValues;
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
  const { data } = await axios.get(`${process.env.ALLOCATION_PLACEMENTS}?status=${status}`);
  const fromDate = new Date(Date.now() - ms(process.env.TIMER_INTERVAL));
  return data.values.filter(placement => Date.parse(placement.created_at) > fromDate);
};
