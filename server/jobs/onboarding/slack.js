import dotenv from 'dotenv';
import { accessChannel, createPartnerChannel } from '../../modules/slack/slackIntegration';
import {
  creatOrUpdatePartnerRecord,
  createOrUpdateSlackAutomation,
} from '../../modules/automations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID, SLACK_RACK_CITY_CHANNEL_ID } = process.env;

/**
 * @desc Automates developer onboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {Number} automationId ID of the automation being carried out
 *
 * @returns {undefined}
 */
const slackOnBoarding = async (placement, automationId) => {
  const { fellow } = placement;
  const { client_name: partnerName, client_id: partnerId } = placement;
  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick').then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  accessChannel(fellow.email, SLACK_RACK_CITY_CHANNEL_ID, 'invite').then(response => createOrUpdateSlackAutomation({ ...response, automationId }));
  const [internalSlackChannel, generalSlackChannel] = await Promise.all([
    createPartnerChannel(partnerName, 'internal'),
    createPartnerChannel(partnerName, 'general'),
  ]);
  createOrUpdateSlackAutomation({ ...internalSlackChannel, automationId });
  createOrUpdateSlackAutomation({ ...generalSlackChannel, automationId });
  accessChannel(fellow.email, generalSlackChannel.channelId, 'invite').then(
    result => createOrUpdateSlackAutomation({ ...result, automationId }),
  );
  creatOrUpdatePartnerRecord({
    partnerId,
    name: partnerName,
    slackChannels: {
      internal: internalSlackChannel.channelId,
      general: generalSlackChannel.channelId,
    },
  });
};

export default slackOnBoarding;
