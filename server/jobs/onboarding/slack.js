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
 * @returns {void}
 */
export default function slackOnBoarding(placement, automationResult) {
  const { fellow } = placement;
  const { client_id: partnerId } = placement;
  let partnerChannelInfo;
  return removeFromChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID)
    .then(() => createPartnerChannels(partnerId)
      .then((res) => {
        const { generalChannel: { id: partnerChannelId } } = res;
        partnerChannelInfo = partnerChannelId;
        automationResult.slackOnBoarding = 'success';
      })
      .catch(() => {
        automationResult.slackOnBoarding = 'failure';
      }))
    .then(() => addToChannel(fellow.email, partnerChannelInfo)
      .then(() => {
        automationResult.slackOnBoarding = 'success';
      })
      .catch(() => {
        automationResult.slackOnBoarding = 'failure';
      }))
    .catch(() => {
      automationResult.slackOnBoarding = 'failure';
    });
}
