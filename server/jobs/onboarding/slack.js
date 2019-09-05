import dotenv from 'dotenv';
import { accessChannel } from '../../modules/slack/slackIntegration';
import { createOrUpdateSlackAutomation } from '../../modules/automations';
import env from '../../validator';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID, SLACK_RACK_CITY_CHANNEL_ID } = env;

const automationData = channel => ({
  status: 'success',
  ...channel,
  type: channel.channelProvision,
  statusMessage: `${channel.channelName} slack channel ${channel.channelProvision}d`,
});

/**
 * @desc Perform onboarding automations for partner internal and general channels
 *
 * @param {Object} partner The details of the partner in the engagement
 * @param {Object} fellow Details of the fellow to be onboarded in the engagement
 * @param {Number} automationId ID of the automation being carried out
 *
 * @returns {Promise} Promise to return an array of channelIds of the
 * channels(internal and general) used in automation
 */
const partnerChannelAutomations = ({ slackChannels }, fellow, automationId) => {
  const internalAutomationData = automationData(slackChannels.internal);
  const generalAutomationData = automationData(slackChannels.general);
  createOrUpdateSlackAutomation({ ...internalAutomationData, automationId });
  createOrUpdateSlackAutomation({ ...generalAutomationData, automationId });
  accessChannel(fellow.email, slackChannels.general.channelId, 'invite').then(result => createOrUpdateSlackAutomation({ ...result, automationId }));
};

/**
 * @desc Automates developer onboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Number} automationId ID of the automation being carried out
 *
 * @returns {Promise} Promise to return upserted partner details after automation
 */
const slackOnBoarding = async (placement, partner, automationId) => {
  const { fellow } = placement;
  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick').then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  accessChannel(fellow.email, SLACK_RACK_CITY_CHANNEL_ID, 'invite').then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  partnerChannelAutomations(partner, fellow, automationId);
};

export default slackOnBoarding;
