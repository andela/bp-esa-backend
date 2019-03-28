import dotenv from 'dotenv';
import { accessChannel } from '../../modules/slack/slackIntegration';
import { getPartnerRecord, createOrUpdateSlackAutomation } from '../../modules/automations';
/* eslint-disable no-param-reassign */

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
  getPartnerRecord(partnerId).then(async (partnerRecord) => {
    const response = await accessChannel(
      fellow.email,
      partnerRecord && partnerRecord.channelId,
      'kick',
    );
    return createOrUpdateSlackAutomation({ ...response, automationId });
  });
}
