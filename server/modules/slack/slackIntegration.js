import { WebClient } from '@slack/client';
import dotenv from 'dotenv';
import makeChannelNames from '../../helpers/slackHelpers';
import { redisdb } from '../../helpers/redis';

dotenv.config();
const { SCAN_RANGE, REJECT_RATE_LIMIT, SLACK_TOKEN } = process.env;
let rejectRateLimit = false;
if (typeof REJECT_RATE_LIMIT !== 'undefined') {
  rejectRateLimit = REJECT_RATE_LIMIT;
}
export const slackClient = new WebClient(SLACK_TOKEN, {
  rejectRateLimitCalls: rejectRateLimit,
  retryConfig: {
    retries: 1,
    minTimeout: 10 * 1000,
    maxTimeout: 10 * 1000,
  },
});

/**
 * @func createChannel
 * @desc Create a slack channel(and store it in the database)
 *
 * @param {Object} channelDetails The details of the channel to be created
 * @returns {object} The details of the slack channel created.
 */
const createChannel = async (channelDetails) => {
  const data = { ...channelDetails };
  try {
    const { group } = await slackClient.groups.create({ name: data.channelName });
    redisdb.set(group.name, JSON.stringify(group));
    data.channelId = group.id;
    return data;
  } catch (error) {
    data.status = 'failure';
    data.statusMessage = error.message;
    return data;
  }
};

const automationData = (partnerName, channelType) => {
  const channelName = makeChannelNames(partnerName, channelType);
  return {
    slackUserId: null,
    channelName,
    status: 'success',
  };
};

/**
 * @desc Returns matched channels from a list of slack channels
 * @param {Array} channels List of channels from slack API to filter
 * @param {String} channelName The channel name to filter against
 *
 * @returns {Array} List of channels which match the given channelName
 */
const findMatches = (channels, channelName) => channels.filter((channel) => {
  redisdb.set(channel.name, JSON.stringify(channel));
  return channel.name.includes(channelName);
});

const findChannels = async (options, channelName, { response_metadata: metaData, channels }) => {
  // Check if channel name matches any in results of the current page
  const matchedChannels = findMatches(channels, channelName);
  if (matchedChannels.length) return matchedChannels;
  // When a `next_cursor` exists, recursively call this function to get the next page.
  if (metaData && metaData.next_cursor && metaData.next_cursor.length) {
    // Make a copy of options
    const pageOptions = { ...options };
    // Add the `cursor` argument
    pageOptions.cursor = metaData.next_cursor;
    return findChannels(options, channelName, await slackClient.conversations.list(pageOptions));
  }
  // Otherwise, we're done, channel not found
  return [];
};

const getMatchingChannels = async (channelName, actual = null) => {
  const name = actual ? channelName : channelName.slice(0, 7);
  const [, result] = await redisdb.scan(0, 'match', `*${name}*`, 'count', SCAN_RANGE);
  if (!result.length) {
    const options = { limit: 999, exclude_archived: true, types: 'public_channel,private_channel' };
    return findChannels(options, name, await slackClient.conversations.list(options));
  }
  return result;
};

const searchConditions = key => ({
  general: key !== '-int',
  internal: key === '-int',
});

const channelDetails = async found => ({
  true: found,
  false: JSON.parse(await redisdb.get(found)),
});
const searchKey = channel => ({
  true: channel.name.slice(-4),
  false: channel.slice(-4),
});
const findOne = async (result, channelType) => {
  if (result.length) {
    const found = result.find((channel) => {
      const key = searchKey(channel)[Boolean(channel.name)];
      return searchConditions(key)[channelType];
    });
    return found ? channelDetails(found)[Boolean(found.name)] : null;
  }
};

const matchedChannels = (data, partnerData) => ({
  true: () => {
    data.channelName = partnerData.channel_name.slice(0, -4);
    return getMatchingChannels(data.channelName, true);
  },
  false: getMatchingChannels(data.channelName),
});

/**
 * @function findOrCreatePartnerChannel
 * @desc Create slack channels for a partner engagement
 *
 * @param {Object} partnerData Details of the partner
 * @param {String} channelType The type of channel: internal || general
 * @param {String} jobType The type of job being executed: onboarding || offboarding
 *
 * @returns {Object} An object containing details of the created channels
 */
export const findOrCreatePartnerChannel = async (partnerData, channelType, jobType) => {
  const data = automationData(partnerData.name, channelType);
  const result = await matchedChannels(data, partnerData)[
    Boolean(partnerData.channel_name && partnerData.channel_name.length)
  ];
  const existingChannel = await findOne(result, channelType);
  if (existingChannel) {
    return {
      ...data,
      channelName: existingChannel.name,
      channelId: existingChannel.id,
      type: 'retrieve',
      statusMessage: `${existingChannel.name} slack channel retrieved`,
    };
  }
  if (jobType === 'onboarding') {
    data.type = 'create';
    data.statusMessage = `${data.channelName} slack channel created`;
    return createChannel(data);
  }
  return {
    ...data,
    status: 'failure',
    statusMessage: 'Could not find partner channel for the offboarding',
  };
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

const contextObject = {
  invite: { message: 'invited to', target: 'users' },
  kick: { message: 'kicked from', target: 'user' },
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
    channelInfo = await slackClient.conversations.info({ channel: channelId });
    const slackAction = slackClient.conversations[context];
    const userId = await getSlackUserId(email);
    await slackAction({ [contextObject[context].target]: userId, channel: channelId });
    return {
      slackUserId: userId,
      channelId,
      channelName: channelInfo.channel.name,
      type: context,
      status: 'success',
      statusMessage: `${email} ${contextObject[context].message} channel`,
    };
  } catch (error) {
    return {
      slackUserId: null,
      channelId,
      channelName: channelInfo && channelInfo.channel.name,
      type: context,
      status: 'failure',
      statusMessage: `${error.message}`,
    };
  }
};
