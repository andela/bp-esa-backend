import dotenv from 'dotenv';
import { accessChannel, createPartnerChannel } from '../../modules/slack/slackIntegration';
import { saveSlackAutomation } from '../../../db/operations/automations';

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
  const { client_name: partnerName, id: partnerId } = placement;

  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick');
  const partnerDetailInternal = await createPartnerChannel(partnerName, 'internal');
  const partnerDetailGeneral = await createPartnerChannel(partnerName, 'general').then((channel) => {
    if (channel.id) {
      accessChannel(fellow.email, channel.id, 'invite');
      saveSlackAutomation(partnerId, partnerName, partnerDetailInternal, partnerDetailGeneral);
    }
    return channel;
  });
};

export default slackOnBoarding;
