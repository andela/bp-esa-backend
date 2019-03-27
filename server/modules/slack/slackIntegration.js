import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import makeChannelNames from '../../helpers/slackHelpers';
import { getSlackAutomation } from '../automations';

dotenv.config();
const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);

const channelData = channelName => ({
  slackUserId: null,
  channelName,
  type: 'create',
  status: 'success',
  statusMessage: `${channelName} slack channel created`,
});

const skippedStatus = {
  'An API error occurred: not_in_group': 'skipped',
  'An API error occurred: name_taken': 'skipped',
  'An API error occurred: cant_kick_self': 'skipped',
  'An API error occurred: cant_invite_self': 'skipped',
};

/**
 * @func getExistingChannel
 * @desc Get an existing slack channel(from the database)
 * @param {string} channelName The name of the slack channel to get
 *
 * @returns {object} An object that would always contain
 * a truthy value "channelExist" to tell if the channel exist or not.
 */
const getExistingChannel = async (channelName) => {
  let channelExists = false;
  let channelId = null;
  const result = await getSlackAutomation({ channelName });
  if (result) {
    channelExists = true;
    ({ channelId } = result);
  }
  return { channelExists, channelId };
};

/**
 * @func createChannel
 * @desc Create a slack channel(and store it in the database)
 *
 * @param {string} channelName The name of the channel to be created.
 * @returns {object} The details of the slack channel created.
 */
const createChannel = async (channelName) => {
  const data = channelData(channelName);
  try {
    const result = await slackClient.groups.create({ name: channelName });
    data.channelId = result.group.id;
    return data;
  } catch (error) {
    data.status = skippedStatus[error.message] || 'failure';
    data.statusMessage = error.message;
    let channelId;
    if (error.data && error.data.error === 'name_taken') {
      ({ channelId = null } = await getExistingChannel(data.channelName));
    }
    data.channelId = channelId;
    return data;
  }
};

const automationData = (partnerName, channelType) => {
  const channelName = makeChannelNames(partnerName, channelType);
  return channelData(channelName);
};

/**
 * @function createPartnerChannel
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerName Name of the partner
 * @param {string} channelType The type of channel: internal || general
 *
 * @returns {Object} An object containing details of the created channels
 */
export const createPartnerChannel = async (partnerName, channelType) => {
  const data = automationData(partnerName, channelType);
  return createChannel(data.channelName);
};

/**
 * @function getSlackUserId
 * @desc Search for a slack user by email
 *
 * @param {String} email The user's email
 * @returns {string} The slack user's id
 */
export const getSlackUserId = async (email) => {
  const { lookupByEmail } = slackClient.users;
  const { user } = await lookupByEmail({ email });
  return user.id;
};

/**
 * @desc Add or remove a fellow from a channel after being placed or rolled-off
 *
 * @param {string} email User's email
 * @param {string} channelId The channel id
 * @param {string} context The action to perform: invite || kick
 *
 * @returns {Object} The result of the operation performed
 */
export const accessChannel = async (email, channelId, context) => {
  let channelInfo;
  try {
    channelInfo = await slackClient.groups.info({ channel: channelId });
    const slackAction = slackClient.groups[context];
    const userId = await getSlackUserId(email);
    await slackAction({ user: userId, channel: channelId });
    return {
      slackUserId: userId,
      channelId,
      channelName: channelInfo.group.name,
      type: context,
      status: 'success',
      statusMessage: `${email} ${context === 'invite' ? 'invited to' : 'kicked from'} channel`,
    };
  } catch (error) {
    return {
      slackUserId: null,
      channelId,
      channelName: channelInfo && channelInfo.group.name,
      type: context,
      status: skippedStatus[error.message] || 'failure',
      statusMessage: error.message,
    };
  }
};
