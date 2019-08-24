import { WebClient, LogLevel } from '@slack/client';
import dotenv from 'dotenv';
import makeChannelNames from '../../helpers/slackHelpers';
import { redisdb } from '../../helpers/redis';
import responseObject from '../utils';

dotenv.config();
dotenv.config();
const { SCAN_RANGE, REJECT_RATE_LIMIT, SLACK_TOKEN } = process.env;
let rejectRateLimit = false;
if (typeof REJECT_RATE_LIMIT !== 'undefined') {
  rejectRateLimit = REJECT_RATE_LIMIT;
}
class Slack {
  constructor() {
    const slackClient = new WebClient(SLACK_TOKEN, {
      logLevel: LogLevel.ERROR,
      rejectRateLimitCalls: rejectRateLimit,
      retryConfig: {
        retries: 1,
        minTimeout: 10 * 1000,
        maxTimeout: 10 * 1000,
      },
    });
    return slackClient;
  }

  // static async slackClient() {
  //   const slackClient = await new WebClient(SLACK_TOKEN, {
  //     logLevel: LogLevel.DEBUG,
  //     rejectRateLimitCalls: rejectRateLimit,
  //     retryConfig: {
  //       retries: 1,
  //       minTimeout: 10 * 1000,
  //       maxTimeout: 10 * 1000,
  //     },
  //   });
  //   return slackClient;
  // }

  /**
   * @func createChannel
   * @desc Create a slack channel(and store it in the database)
   *
   * @param {Object} channelDetails The details of the channel to be created
   * @returns {Promise} Promise to return the details of the slack channel created.
   */
  static async createChannel(channelDetails) {
    console.log('**********1**********');
    const data = { ...channelDetails };
    try {
      const { group } = await new Slack().groups.create({
        name: data.channelName,
      });
      redisdb.set(group.name, JSON.stringify(group));
      data.channelId = group.id;
      return data;
    } catch (error) {
      console.log('this error', error);
      data.status = 'failure';
      data.statusMessage = error.message;
      return data;
    }
  }

  /**
   * @desc Returns matched channels from a list of slack channels
   * @param {Array} channels List of channels from slack API to filter
   * @param {String} channelName The channel name to filter against
   *
   * @returns {Array} List of channels which match the given channelName
   */
  static findMatches(channels, channelName) {
    console.log('**********2**********');
    console.log('**********2**********');
    return channels.filter((channel) => {
      redisdb.set(channel.name, JSON.stringify(channel));
      return channel.name.includes(channelName);
    });
  }

  /**
   *@desc Search matching channels by name from slack conversations API
   *
   * @param {String} options Custom options to apply like limit, types and exclude_archived
   * @param {String} channelName Search key with which to find channels with matching names
   * @param {Object} apiResponse Response data for the page of slack channels retrieved
   * @returns {Promise} Promise to return an array of slack channel objects matching the search key
   */
  static async searchChannels(options, channelName, apiResponse) {
    console.log('**********3**********');
    const { response_metadata: metaData, channels } = apiResponse;
    // Check if channel name matches any in results of the current page
    const matchedChannels = this.findMatches(channels, channelName);
    if (matchedChannels.length) return matchedChannels;
    // When a `next_cursor` exists, recursively call this function to get the next page.
    if (metaData && metaData.next_cursor && metaData.next_cursor.length) {
      // Make a copy of options
      const pageOptions = { ...options, cursor: metaData.next_cursor };
      return this.searchChannels(
        options,
        channelName,
        await new Slack().conversations.list(pageOptions),
      );
    }
    // Otherwise, we're done, no channel found
    return [];
  }

  /**
   *@desc Retrieve matching channels from redisDB or slack API
   *
   * @param {String} channelName Search key with which to find channels with matching names
   * @param {Boolean} [actual=null] Is the channelName generated or from Andela Partner API?
   * @returns {Promise} Promise to return an array of matching channels
   */
  static async getMatchingChannels(channelName, actual = null) {
    console.log('**********4**********');
    const name = actual ? channelName : channelName.slice(0, 7);
    const [, result] = await redisdb.scan(
      0,
      'match',
      `*${name}*`,
      'count',
      SCAN_RANGE,
    );
    if (!result.length) {
      const options = {
        limit: 999,
        exclude_archived: true,
        types: 'public_channel,private_channel',
      };
      return this.searchChannels(
        options,
        name,
        await new Slack().conversations.list(options),
      );
    }
    return result;
  }

  static findConditions(key) {
    return {
      general: key !== '-int',
      internal: key === '-int',
    };
  }

  // if channel is an object, return the last 4 digits of channel.name,
  // if channel is string, return last 4 digits
  static searchKey(channel) {
    return channel.name ? channel.name.slice(-4) : channel.slice(-4);
  }

  /**
   *@desc Find exact matching channel from list of searched channels
   *
   * @param {Array} result List of channels (search results),from which to find a channel
   * @param {String} channelType The type of channel to find: internal || general
   * @returns {Object} The details of the channel found
   */
  static async findOne(result, channelType) {
    console.log('**********5**********');
    if (result.length) {
      const found = result.find((channel) => {
        const key = this.searchKey(channel);
        return this.findConditions(key)[channelType];
      });
      if (found) {
        return found.name ? found : JSON.parse(await redisdb.get(found));
      }
    }
    return undefined;
  }

  /**
   *@desc Retrieve matching channels based on partner channelName given
   *
   * @param {Object} channelData Details of the channel with which to carry out automation
   * @param {Object} partnerData Details of the partner involved in the engagement
   * @returns {Object} Contains the functions to call, given partner channelName or not
   * @param {Boolean} partnerChannelGiven Whether there is a name or not
   */
  static matchedChannels(channelData, partnerData, partnerChannelGiven) {
    console.log('**********6**********');
    if (partnerChannelGiven) {
      const channelName = partnerData.channel_name.slice(0, -4);
      return this.getMatchingChannels(channelName, true);
    }
    return this.getMatchingChannels(channelData.channelName);
  }

  /**
   * @function findOrCreatePartnerChannel
   * @desc Find or create slack channels for a partner engagement
   *
   * @param {Object} partnerData Details of the partner
   * @param {String} channelType The type of channel: internal || general
   * @param {String} jobType The type of job being executed: onboarding || offboarding
   *
   * @returns {Promise} Promise to return an object containing details of the channel
   */
  static async findOrCreatePartnerChannel(partnerData, channelType, jobType) {
    console.log('**********7**********');
    const channelData = {
      channelName: makeChannelNames(partnerData.name, channelType),
    };
    const partnerChannelGiven = Boolean(
      partnerData.channel_name && partnerData.channel_name.length,
    );
    console.log('---->', partnerChannelGiven);
    console.log(channelData, partnerData);
    const result = await this.matchedChannels(
      channelData,
      partnerData,
      partnerChannelGiven,
    );
    console.log('$$$$$$$$$$[partnerChannelGiven]()', result);
    const existingChannel = await this.findOne(result, channelType);
    if (existingChannel) {
      return {
        type: 'retrieve',
        channelName: existingChannel.name,
        channelId: existingChannel.id,
      };
    }
    if (jobType === 'onboarding') {
      channelData.type = 'create';
      const newChannel = await this.createChannel(channelData);
      return newChannel;
    }
    // Could not find partner channel for the offboarding
    return { status: 'failure' };
  }

  /**
   * @function getSlackUserId
   * @desc Search for a slack user by email
   *
   * @param {String} email The user's email
   * @returns {String} The slack user's id
   */
  static async getSlackUserId(email) {
    console.log('---getSlackUserId--->');
    const { lookupByEmail } = await new Slack().users;
    console.log('---getSlackUserId--->', lookupByEmail);
    console.log('--email-->', email);
    const { user } = await lookupByEmail({ email });
    console.log('---user--->', user.id);
    return user.id;
  }

  /**
   * @desc Add or remove a fellow from a channel after being placed or rolled-off
   *
   * @param {string} email User's email
   * @param {string} channelId The channel id
   * @param {string} context The action to perform: invite || kick
   *
   * @returns {Promise} Promise to return the result of the operation performed
   */
  static async accessChannel(email, channelId, context) {
    console.log('**********8**********');
    console.log('--this-channel-->', channelId);
    let channelInfo;

    const contextObject = {
      invite: { message: 'invited to', target: 'users' },
      kick: { message: 'kicked from', target: 'user' },
    };

    const skippedErrors = [
      'An API error occurred: not_in_channel',
      'An API error occurred: already_in_channel',
      'An API error occurred: not_in_group',
      // 'An API error occurred: channel_not_found',
    ];
    try {
      channelInfo = await new Slack().conversations.info({
        channel: channelId,
      });
      console.log('~~~~~~~~~~~~~~~~~~~', channelInfo && channelInfo.id);
      console.log('~~~~~~~~~~~~~~~~~~~', channelInfo && channelInfo.purpose);
      // const slackAction = await new Slack().conversations[context];
      // console.log('000slackAction000', slackAction);
      // const userId = await this.getSlackUserId(email);
      // console.log('###########', userId);
      // await slackAction({
      //   [contextObject[context].target]: userId,
      //   channel: channelId,
      // });

      return {
        slackUserId: 'userId',
        channelId,
        channelName: channelInfo.channel.name,
        type: context,
        status: 'success',
        statusMessage: `${email} ${contextObject[context].message} channel`,
      };
    } catch (error) {
      console.log('**********10**********');
      console.log('---error.data.error-->', error);
      console.log(
        '---error.data.errors[0]-->',
        error.data && error.data.errors && error.data.errors[0],
      );
      console.log('^^^^^^^^^tomation', channelId);
      console.log('^^^^^^^^^tomation', error.data.error);
      console.log('^^^^^^^^^tomation', context);
      if (skippedErrors.includes(error.message)) {
        return responseObject(
          channelId,
          channelInfo,
          error,
          'success',
          context,
        );
      }
      return responseObject(channelId, channelInfo, error, 'failure', context);
    }
  }
}
export default Slack;
