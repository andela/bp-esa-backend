import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import { findPartnerById, updatePartnerStore } from '../allocations';
import makeChannelNames from '../../helpers/slackHelpers';
import response from '../../helpers/response';

dotenv.config();

const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);

/**
 * @function createChannel
 * @desc Create slack channel
 *
 * @param {string} name - Name of the channel
 * @returns {Object} - An object containing the newly created channel
 */
export const createChannel = async (name) => {
  try {
    const { create } = slackClient.groups;
    return await create({ name });
  } catch (error) {
    // istanbul ignore next
    return { status: 'error', message: error };
  }
};
/**
 * @desc Returns details of the created partner channels
 *
 * @param {string} partnerId - ID of the partner
 * @param {object} createGeneral - Details of general channel created
 * @param {object} createInternal - Details of internal channel created
 *
 * @returns {object} - Data of the new channels created
 */
const newChannels = (partnerId, createGeneral, createInternal) => ({
  partnerId,
  generalChannel: {
    id: createGeneral.group.id,
    name: createGeneral.group.name,
  },
  internalChannel: {
    id: createInternal.group.id,
    name: createInternal.group.name,
  },
});
export const channelExists = (...args) => {
  const [generalExists, internalDuplicate, generalChannel, internalChannel] = args;
  if (generalExists || internalDuplicate === 'name_taken') {
    const channel = generalExists ? generalChannel : internalChannel;
    return { status: 'error', message: `The channel '${channel}' already exists` };
  }
  return false;
};

/**
 * @desc Validates channels created and return if successful
 *
 * @param {any} args - Details of channels to be validated
 *
 * @returns {object} - Channels created
 */
export const returnValidChannels = (...args) => {
  const [partnerId, exists, createGeneral, createInternal] = args;
  if (!exists && createGeneral.ok === true && createInternal.ok === true) {
    return newChannels(partnerId, createGeneral, createInternal);
  }
  return exists;
};

/**
 * @function createPartnerChannels
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerId - ID of the partner
 * @returns {Object} - An object containing details of the created channels
 */
export const createPartnerChannels = async (partnerId) => {
  try {
    let partner;
    partner = await findPartnerById(partnerId);
    if (!partner) {
      await updatePartnerStore();
      partner = await findPartnerById(partnerId);
    }
    if (partner === undefined) throw new Error('Partner record was not found');

    const { generalChannel, internalChannel } = makeChannelNames(partner.name);
    const createGeneral = await createChannel(generalChannel);
    const createInternal = await createChannel(internalChannel);

    const generalDuplicate = createGeneral.message ? createGeneral.data.error : null;
    const internalDuplicate = createInternal.message ? createInternal.data.error : null;
    const generalExists = generalDuplicate === 'name_taken';
    const exists = channelExists(generalExists, internalDuplicate, generalChannel, internalChannel);
    return returnValidChannels(partnerId, exists, createGeneral, createInternal);
  } catch (error) {
    // istanbul ignore next
    return error.message;
  }
};

/**
 * @function getSlackUser
 * @desc search for a slack user by email
 *
 * @param {String} email - the user's email
 * @returns {string} slackID - the slack user's id
 */
export const getSlackUser = async (email) => {
  try {
    const { lookupByEmail } = slackClient.users;
    const slackUser = await lookupByEmail({ email });
    return slackUser.user.id;
  } catch (error) {
    // istanbul ignore next
    return { status: 'error', message: error };
  }
};

/**
 * @desc - Add or remove a fellow from a channel after
 * being placed or rolled-off an engagement
 *
 * @param {string} email - User's email
 * @param {string} channel - The channel id
 *
 * @returns {Object} - The result of the operation performed
 */

export const addOrRemove = async (email, channel, context) => {
  try {
    const invited = context === 'invite';
    const slackAction = slackClient.groups[context];
    const user = await getSlackUser(email);
    const status = await slackAction({ user, channel });
    const error = invited ? 'Could not add user to channel' : 'Could not remove user from channel';
    if (status.ok === false) {
      throw new Error(error);
    }
    const success = invited
      ? 'User added to channel successfully'
      : 'User removed from channel successfully';
    return { status: 'success', message: success };
  } catch (error) {
    // istanbul ignore next
    throw new Error(error);
  }
};

/**
 * @desc add a fellow to a channel after being placed
 *
 * @param {string} fellowEmail - user's email
 * @param {string} channel - the channel id
 *
 * @returns {Object} - The result after a user has been added to a channel
 */
export const addToChannel = (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'invite');

/**
 * @function removeFromChannel
 * @desc remove a user from a slack channel
 *
 * @param {string} fellowEmail - user's email
 * @param {string} channel - the channel id
 *
 * @returns {Object} - The result after a user has been removed from a channel
 */
export const removeFromChannel = (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'kick');