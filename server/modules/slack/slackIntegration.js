import { WebClient } from '@slack/client';
import { findPartnerById } from '../allocations';
import makeChannelNames from '../../helpers/slackHelpers';

const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);

/**
 * @function createChannel
 * @desc Create slack channel
 *
 * @param {string} name - Name of the channel
 * @returns {Object} - An object containing the newly created channel
 */
const createChannel = async (name) => {
  try {
    const { create } = slackClient.groups;
    const createResult = await create({ name });

    return createResult;
  } catch (error) {
    return error;
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
function newChannels(partnerId, createGeneral, createInternal) {
  return {
    partnerId,
    generalChannel: {
      id: createGeneral.group.id,
      name: createGeneral.group.name,
    },
    internalChannel: {
      id: createInternal.group.id,
      name: createInternal.group.name,
    },
  };
}
const checkExists = (...args) => {
  const [generalExists, internalDuplicate, generalChannel, internalChannel] = args;
  if (generalExists || internalDuplicate === 'name_taken') {
    const channel = generalExists ? generalChannel : internalChannel;
    throw new Error(`The channel '${channel}' already exists`);
  }
};

/**
 * @desc Validates channels created and return if successful
 *
 * @param {any} args - Details of channels to be validated
 *
 * @returns {object} - Channels created
 */
function returnValidChannels(...args) {
  const [
    partnerId,
    generalExists,
    internalDuplicate,
    generalChannel,
    internalChannel,
    createGeneral,
    createInternal,
  ] = args;
  checkExists(generalExists, internalDuplicate, generalChannel, internalChannel);
  if (createGeneral.ok === true && createInternal.ok === true) {
    return newChannels(partnerId, createGeneral, createInternal);
  }
  throw new Error('Could not create new channels');
}

/**
 * @function createPartnerChannels
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerId - ID of the partner
 * @returns {Object} - An object containing details of the created channels
 */
export const createPartnerChannels = async (partnerId) => {
  try {
    const partner = await findPartnerById(partnerId);
    if (partner === undefined) throw new Error('Partner record was not found');

    const { generalChannel, internalChannel } = makeChannelNames(partner.name);
    const createGeneral = await createChannel(generalChannel);
    const createInternal = await createChannel(internalChannel);

    const generalDuplicate = createGeneral.message ? createGeneral.data.error : null;
    const internalDuplicate = createInternal.message ? createInternal.data.error : null;
    const generalExists = generalDuplicate === 'name_taken';
    return returnValidChannels(
      partnerId,
      generalExists,
      internalDuplicate,
      generalChannel,
      internalChannel,
      createGeneral,
      createInternal,
    );
  } catch (error) {
    return error.message;
  }
};

/**
 * @function getSlackUser
 * @desc search for a slack user by email
 *
 * @param email - the user's email
 * @returns {string} slackID - the slack user's id
 */
export const getSlackUser = async (email) => {
  try {
    const { lookupByEmail } = slackClient.users;
    const slackUser = await lookupByEmail({ email });
    const { id } = slackUser.user;

    return id;
  } catch (error) {
    return { error };
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

const addOrRemove = async (email, channel, context) => {
  try {
    const condition = context === 'invite';
    const action = condition ? 'invite' : 'kick';
    const slackResponse = slackClient.groups[action];
    const user = await getSlackUser(email);
    const status = slackResponse({ user, channel });
    const error = condition
      ? 'Could not add user to channel'
      : 'Could not remove user from channel';
    if (status.ok === false) {
      throw new Error(error);
    }
    const success = condition
      ? 'User added to channel successfully'
      : 'User removed from channel successfully';
    return { message: success };
  } catch (error) {
    return {
      message: error,
      error,
    };
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
export const addToChannel = async (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'invite');

/**
 * @function removeFromChannel
 * @desc remove a user from a slack channel
 *
 * @param {string} fellowEmail - user's email
 * @param {string} channel - the channel id
 *
 * @returns {Object} - The result after a user has been removed from a channel
 */
export const removeFromChannel = async (fellowEmail, channel) => addOrRemove(fellowEmail, channel, 'kick');
