import axios from 'axios';
import ms from 'ms';
import https from 'https';
import { redisdb } from '../helpers/redis';
import db from '../models';
import { findOrCreatePartnerChannel } from './slack/slackIntegration';

require('dotenv').config();

// Axios authorization header setup
axios.defaults.headers.common = { 'api-token': process.env.ANDELA_ALLOCATIONS_API_TOKEN };

/**
 *@desc Fetch a partner's profile from andela API and save to redisDB
 *
 * @param {String} partnerId The ID of the partner to fetch
 * @returns {Promise} Promise to return the partner data retrieved
 */
const getPartnerfromAPI = async (partnerId) => {
  const { data } = await axios.get(`${process.env.ANDELA_PARTNERS}/${partnerId}`, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });
  redisdb.set(data.id, JSON.stringify(data));
  return data;
};

/**
 *@desc Retrieve partner data from database or Andela API
 *
 * @param {String} partnerId The ID of the partner to retrieve
 * @returns {Promise} Promise to return the partner's data
 */
export const retrievePartner = async (partnerId) => {
  const result = await db.Partner.findOne({ where: { partnerId } });
  return result || getPartnerfromAPI(partnerId);
};

/**
 *@desc Find or create the slack internal channel of a partner
 *
 * @param {Object} newPartner The details of the target partner
 * @param {String} jobType The type of automation carried out: onboarding || offboarding,
 * if onboarding, does not create channel when channel not found
 *
 * @returns {Promise} Promise to return the partner channel Object found or created
 */
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
 * @returns {Promise} Promise to return the data of the partner
 */
export async function findPartnerById(partnerId, jobType) {
  const partner = await redisdb.get(partnerId);
  if (!partner) {
    const newPartner = await retrievePartner(partnerId);
    if (newPartner.slackChannels) {
      redisdb.set(newPartner.partnerId, newPartner);
      return newPartner;
    }
    const [genChannel = {}, intChannel = {}] = await Promise.all([
      findOrCreatePartnerChannel(newPartner, 'general', jobType),
      generateInternalChannel(newPartner, jobType),
    ]);
    newPartner.slackChannels = {
      general: {
        channelId: genChannel.channelId,
        channelName: genChannel.channelName,
        channelProvision: genChannel.type,
      },
      internal: intChannel.channelId
        ? {
          channelId: intChannel.channelId,
          channelName: intChannel.channelName,
          channelProvision: intChannel.type,
        }
        : {
          channelId: newPartner.channel_id,
          channelName: newPartner.channel_name,
          channelProvision: 'retrieve',
        },
    };
    const [{ dataValues: savedPartner }] = await db.Partner.upsert(newPartner, { returning: true });
    redisdb.set(savedPartner.partnerId, JSON.stringify(savedPartner));
    return savedPartner;
  }
  return JSON.parse(partner);
}

/**
 * @desc Fetches new placements by status, from the last TIME_INTERVAL
 *
 * @param {string} status The status of placements to fetch from allocations
 * @returns {Promise} Promise to return list of placements
 */
export const fetchNewPlacements = async (status) => {
  const { data } = await axios.get(`${process.env.ALLOCATION_PLACEMENTS}?status=${status}`);
  const fromDate = new Date(Date.now() - ms(process.env.TIMER_INTERVAL));
  return data.values.filter(placement => Date.parse(placement.created_at) > fromDate);
};
