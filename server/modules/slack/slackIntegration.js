import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import makeChannelNames from '../../helpers/slackHelpers';

dotenv.config();
const { SLACK_TOKEN } = process.env;
export const slackClient = new WebClient(SLACK_TOKEN);

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
  const { create } = slackClient.groups;

  try {
    const { group } = await create({ name: channelName });
    // write channel<->partner automation success to database
    const channelDetails = { id: group.id, name: group.name };
    return group.name.endsWith('int')
      ? { internalChannel: channelDetails }
      : { generalChannel: channelDetails };
  } catch (error) {
    // write automation failure to database
    return error;
  }
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

export const accessChannel = async (email, channel, context) => {
  try {
    const slackAction = slackClient.groups[context];
    const user = await getSlackUser(email);
    await slackAction({ user, channel });

    const success = context === 'invite'
      ? 'User added to channel successfully'
      : 'User removed from channel successfully';
    // write automation success to database
    return { status: 'success', message: success };
  } catch (error) {
    // write automation failure to database
    return error;
  }
};
