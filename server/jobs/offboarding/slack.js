import dotenv from 'dotenv';
import { removeFromChannel, addToChannel } from '../../modules/slack/slackIntegration';
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
export default function slackOffboarding(placement, automationResult) {
  const { fellow } = placement;

  return addToChannel(fellow.email, SLACK_AVAILABLE_DEVS_CHANNEL_ID)
    .then(() => removeFromChannel(fellow.email, 'partnerChannelId')
      .then(() => {
        automationResult.slackAutomation = 'success';
      })
      .catch(() => {
        automationResult.slackAutomation = 'failure';
      }))
    .catch(() => {
      automationResult.slackAutomation = 'failure';
    });
}
