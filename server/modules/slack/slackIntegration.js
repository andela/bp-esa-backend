import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import makeChannelNames from '../../helpers/slackHelpers';
import { createOrUpdateSlackAutomation, getSlackAutomation } from '../automations';

dotenv.config();
const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);

/**
 * @func createChannel
 * @desc Create a slack channel(and store it in the database)
 *
 * @param {string} channelName The name of the channel to be created.
 * @returns {object} The details of the slack channel created.
 */
const createChannel = async (channelName) => {
  const result = await slackClient.groups.create({ name: channelName });
  await createOrUpdateSlackAutomation({
    automationId: process.env.AUTOMATION_ID,
    slackUserId: null,
    channelName,
    channelId: result.group.id,
    type: 'create',
    status: 'success',
    statusMessage: `${channelName} slack channel created`,
  });
  return result;
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
 * @function createPartnerChannel
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerName Name of the partner
 * @param {string} channelType The type of channel: internal || general
 *
 * @returns {Object} An object containing details of the created channels
 */
export const createPartnerChannel = async (partnerName, channelType) => {
  const channelName = makeChannelNames(partnerName, channelType);
  try {
    const { group } = await createChannel(channelName);
    return { id: group.id, name: group.name };
  } catch (error) {
    let channelId;
    let channelExists = false;
    if (error.data && (error.data.error === 'name_taken')) {
      ({ channelExists, channelId } = await getExistingChannel(channelName));
    }
    await createOrUpdateSlackAutomation({
      automationId: process.env.AUTOMATION_ID,
      slackUserId: null,
      channelName,
      channelId: channelId || null,
      type: 'create',
      status: channelExists ? 'success' : 'failure',
      statusMessage: channelExists ? 'channel already exist' : `${error.message}`,
    });
    return { id: channelId, name: channelName };
  }
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
  try {
    const slackAction = slackClient.groups[context];
    const channelInfo = await slackClient.groups.info({ channel: channelId });
    const userId = await getSlackUserId(email);
    await slackAction({ user: userId, channel });
    await createOrUpdateSlackAutomation({
      automationId: process.env.AUTOMATION_ID,
      slackUserId: userId,
      channelId: channelId,
      channelName: channelInfo.group.name,
      type: context,
      status: 'success',
      statusMessage: `${email} ${context === 'invite' ? 'invited to' : 'kicked from'} a channel`,
    });
  } catch (error) {
    const channelInfo = await slackClient.groups.info({ channel: channelId });
    await createOrUpdateSlackAutomation({
      automationId: process.env.AUTOMATION_ID,
      slackUserId: null,
      channelId: channelId,
      channelName: channelInfo.group.name,
      type: context,
      status: 'failure',
      statusMessage: `${error.message}`,
    });
  }
};
