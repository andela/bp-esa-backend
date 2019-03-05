import dotenv from 'dotenv';
import { accessChannel, createPartnerChannel } from '../../modules/slack/slackIntegration';
import { creatOrUpdatePartnerRecord } from '../../modules/automations';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID, SLACK_RACK_CITY_CHANNEL_ID } = process.env;

/**
 * @desc Automates developer onboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult results of the automation job
 *
 * @returns {undefined}
 */
const slackOnBoarding = async (placement) => {
  const { fellow } = placement;
  const { client_name: partnerName, client_id: partnerId } = placement;
  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick');
  accessChannel(fellow.email, SLACK_RACK_CITY_CHANNEL_ID, 'invite');
  const internalSlackChannel = await createPartnerChannel(partnerName, 'internal');
  const generalSlackChannel = await createPartnerChannel(partnerName, 'general');
  if (generalSlackChannel && generalSlackChannel.id) {
    accessChannel(fellow.email, generalSlackChannel.id, 'invite');
    creatOrUpdatePartnerRecord({
      partnerId,
      name: partnerName,
      slackChannels: {
        internal: internalSlackChannel.id,
        general: generalSlackChannel.id,
      },
    });
  }
};

export default slackOnBoarding;
