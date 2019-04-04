/* eslint-disable no-param-reassign */
import dotenv from 'dotenv';
import { accessChannel } from '../../modules/slack/slackIntegration';
import { createOrUpdateSlackAutomation } from '../../modules/automations';
import { findPartnerById } from '../../modules/allocations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID } = process.env;

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationId ID of the automation being carried out
 * @returns {undefined}
 */
export default async function slackOffboarding(placement, automationId) {
  const { fellow, client_id: partnerId } = placement;
  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'invite').then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  try {
    const partnerRecord = await findPartnerById(partnerId, 'offboarding');
    const response = await accessChannel(
      fellow.email,
      partnerRecord && partnerRecord.slackChannels.general,
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
