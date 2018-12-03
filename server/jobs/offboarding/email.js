
/* eslint-disable no-param-reassign */
import { itEmailTransport, opsOffBoardingEmailTransport } from '../../modules/email/emailModule';

/**
 * @desc Automates developer offboarding on slack
 *
 * @param {array} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default function emailOffboarding(placement, automationResult) {
  const {
    fellow: { name, email, location },
    end_date: endDate,
    client_name: partnerName,
  } = placement;
  return itEmailTransport(name, email, location, endDate)
    .then(() => opsOffBoardingEmailTransport(name, partnerName, email, location, endDate)
      .then(() => {
        automationResult.emailAutomation = 'success';
      })
      .catch(() => {
        automationResult.emailAutomation = 'failure';
      }))
    .catch(() => {
      automationResult.emailAutomation = 'failure';
    });
}
