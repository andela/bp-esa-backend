/* eslint-disable no-param-reassign */
import { sendITOffboardingMail, sendSOPOffboardingMail } from '../../modules/email/emailModule';
import { getMailInfo } from '../helpers';

/**
 * @desc Automates developer offboarding via email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
export default async function emailOffboarding(placement, automationResult) {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all([sendSOPOffboardingMail(mailInfo), sendITOffboardingMail(mailInfo)]);
    automationResult.emailAutomation = 'success';
  } catch (error) {
    automationResult.emailAutomation = error.message || 'failure';
  }
}
