import dotenv from 'dotenv';
import { accessChannel, createPartnerChannel } from '../../modules/slack/slackIntegration';

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
  const { client_name: partnerName } = placement;

  accessChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID, 'kick');
  accessChannel(fellow.email, SLACK_RACK_CITY_CHANNEL_ID, 'invite');
  createPartnerChannel(partnerName, 'internal');
  createPartnerChannel(partnerName, 'general').then((channel) => {
    if (channel.id) {
      accessChannel(fellow.email, channel.id, 'invite');
    }
  });
};

export default slackOnBoarding;
