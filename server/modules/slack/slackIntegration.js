import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import { findPartnerById } from '../allocations';
import makeChannelNames from '../../helpers/slackHelpers';

dotenv.config();
const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);
/**
 * @desc Returns details of the created partner channel
 *
 * @param {string} partnerId ID of the partner
 * @param {object} channel Details of channel created
 *
 * @returns {object} Details of the new channels created
 */
const newChannels = (partnerId, { group }) => {
  const channelDetails = { id: group.id, name: group.name };
  return group.name.endsWith('int')
    ? { internalChannel: channelDetails }
    : { generalChannel: channelDetails };
};

/**
 * @desc Creates channel and saves channel details to database
 *
 * @param {string} channelName Name of the channel to create
 * @param {object} partnerData Details of the partner to create channel for
 *
 * @returns {object} Details of the channel and partner or error if unsuccessful
 */
const saveChannel = async (channelName, partnerData) => {
  const { create } = slackClient.groups;
  try {
    const channel = await create({ name: channelName });
    // write channel<->partner details to database
    return newChannels(partnerData.id, channel);
  } catch (error) {
    // write error result to database
    return error;
  }
};

/**
 * @function createPartnerChannels
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerId ID of the partner
 * @returns {Object} An object containing details of the created channels
 */
export const createPartnerChannels = async (partnerId) => {
  const partnerData = await findPartnerById(partnerId);
  const { genChannelName, intChannelName } = makeChannelNames(partnerData.name);

  const [generalChannel, internalChannel] = await Promise.all([
    saveChannel(genChannelName, partnerData),
    saveChannel(intChannelName, partnerData),
  ]);
  if (generalChannel.message) throw new Error(generalChannel.message);
  if (internalChannel.message) throw new Error(internalChannel.message);
  return Object.assign({ partnerId }, generalChannel, internalChannel);
};

/**
 * @function getSlackUser
 * @desc Search for a slack user by email
 *
 * @param {String} email The user's email
 * @returns {string} The slack user's id
 */
export const getSlackUser = async (email) => {
  const { lookupByEmail } = slackClient.users;
  const { user } = await lookupByEmail({ email });
  return user.id;
};

/**
 * @desc Add or remove a fellow from a channel after being placed or rolled-off
 *
 * @param {string} email User's email
 * @param {string} channel The channel id
 * @param {string} context The action to perform: invite || kick
 *
 * @returns {Object} The result of the operation performed
 */

export const addOrRemove = async (email, channel, context) => {
  const invited = context === 'invite';
  const slackAction = slackClient.groups[context];
  const user = await getSlackUser(email);
  await slackAction({ user, channel });

  const success = invited
    ? 'User added to channel successfully'
    : 'User removed from channel successfully';
  return { status: 'success', message: success };
};

/**
 * @desc Add a fellow to a channel after being placed
 *
 * @param {string} fellowEmail User's email
 * @param {string} channel The channel id
 *
 * @returns {Promise} Promise to add a user to a channel
 */
export const addToChannel = (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'invite');

/**
 * @function removeFromChannel
 * @desc Remove a user from a slack channel
 *
 * @param {string} fellowEmail User's email
 * @param {string} channel The channel id
 *
 * @returns {Promise} Promise to remove a user from a channel
 */
export const removeFromChannel = (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'kick');
