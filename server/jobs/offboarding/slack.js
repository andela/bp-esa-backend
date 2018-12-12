import dotenv from 'dotenv';
import { accessChannel } from '../../modules/slack/slackIntegration';
/* eslint-disable no-param-reassign */

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID } = process.env;

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {undefined}
 */
export default async function slackOffboarding(placement) {
  const { fellow } = placement;
  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'invite');
  accessChannel(fellow.email, 'partnerChannelId', 'kick');
}
