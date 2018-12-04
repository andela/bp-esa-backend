import dotenv from 'dotenv';
import { removeFromChannel, createPartnerChannels, addToChannel } from '../../modules/slack/slackIntegration';

dotenv.config();
const { SLACK_AVAILABLE_DEVS_CHANNEL_ID } = process.env;
/* eslint-disable no-param-reassign */

/**
 * @desc Automates developer onboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be onboarded
 * @param {object} automationResult results of the automation job
 *
 * @returns {undefined}
 */
const slackOnBoarding = async (placement, automationResult) => {
  const { fellow } = placement;
  const { client_id: partnerId } = placement;

  try {
    await removeFromChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID);
    const partnerChannels = await createPartnerChannels(partnerId);
    const { generalChannel: { id: partnerChannelId } } = partnerChannels;
    await addToChannel(fellow.email, partnerChannelId);
    automationResult.slackOnBoarding = 'success';
  } catch (error) {
    automationResult.slackOnBoarding = error.message || 'failure';
  }
};

export default slackOnBoarding;
