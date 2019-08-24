import dotenv from 'dotenv';
import Slack from '../../modules/slack/slackIntegration';
import { createOrUpdateSlackAutomation } from '../../modules/automations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID } = process.env;

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {Object} placement Placement record whose developer is to be offboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Object} automationId ID of the automation being carried out
 * @returns {Promise} Promise to return the created/updated slack automation
 */
export default async function slackOffboarding(placement, { slackChannels }, automationId) {
  const { fellow } = placement;
  Slack.accessChannel(
    fellow.email,
    SLACK_AVAILABLE_DEVS_CHANNEL_ID,
    'invite',
  ).then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  try {
    const response = await Slack.accessChannel(
      fellow.email,
      slackChannels.general.channelId,
      'kick',
    );
    return createOrUpdateSlackAutomation({ ...response, automationId });
  } catch (error) {
    return createOrUpdateSlackAutomation({
      automationId,
      status: 'failure',
      statusMessage: error.message,
      type: 'kick',
    });
  }
}
