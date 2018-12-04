/* eslint-disable no-param-reassign */
import { sendITOffboardingMail, sendSOPOffboardingMail } from '../../modules/email/emailModule';

/**
 * @desc Automates developer offboarding via email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default async function emailOffboarding(placement, automationResult) {
  const {
    fellow: { name: developerName, email: developerEmail, location: developerLocation },
    end_date: rollOffDate,
    client_name: partnerName,
  } = placement;
  const mailInfo = {
    developerName,
    partnerName,
    developerEmail,
    developerLocation,
    rollOffDate,
    partnerLocation: 'Nairobi',
  };
  try {
    await Promise.all([sendSOPOffboardingMail(mailInfo), sendITOffboardingMail(mailInfo)]);
    automationResult.emailAutomation = 'success';
  } catch (error) {
    automationResult.emailAutomation = error.message || 'failure';
  }
}
