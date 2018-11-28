import { removeFromChannel, addToChannel } from '../../modules/slack/slackIntegration';
/* eslint-disable no-param-reassign */

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default function slackOffboarding(placement, automationResult) {
  const { fellow } = placement;

  return addToChannel(fellow.email, 'AvailableChannelId')
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
