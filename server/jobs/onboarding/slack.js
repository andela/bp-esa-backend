import dotenv from 'dotenv';
import db from '../../models';
import { accessChannel, findOrCreatePartnerChannel } from '../../modules/slack/slackIntegration';
import { createOrUpdateSlackAutomation } from '../../modules/automations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID, SLACK_RACK_CITY_CHANNEL_ID } = process.env;

const onboardPartnerChannels = (partnerName, fellow, automationId) => Promise.all([
  findOrCreatePartnerChannel({ name: partnerName }, 'internal', 'onboarding').then(
    (internalChannel) => {
      createOrUpdateSlackAutomation({ ...internalChannel, automationId });
      return internalChannel.channelId;
    },
  ),
  findOrCreatePartnerChannel({ name: partnerName }, 'general', 'onboarding').then(
    (generalChannel) => {
      createOrUpdateSlackAutomation({ ...generalChannel, automationId });
      accessChannel(fellow.email, generalChannel.channelId, 'invite').then(result => createOrUpdateSlackAutomation({ ...result, automationId }));
      return generalChannel.channelId;
    },
  ),
]);

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
  const [internalChannelId, generalChannelId] = await onboardPartnerChannels(
    partnerName,
    fellow,
    automationId,
  );
  return db.Partner.upsert({
    partnerId,
    name: partnerName,
    slackChannels: {
      internal: internalChannelId,
      general: generalChannelId,
    },
  });
};

export default slackOnBoarding;
