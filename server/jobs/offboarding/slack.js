import dotenv from 'dotenv';
import { accessChannel } from '../../modules/slack/slackIntegration';
import { getPartnerRecord } from '../../modules/automations';
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
  try {
    const { fellow, client_id: partnerId } = placement;
    accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'invite');
    const { slackChannels: { general } } = await getPartnerRecord(partnerId);
    accessChannel(fellow.email, general, 'kick');
  } catch (error) {
    console.log(error.message);
  }
}
