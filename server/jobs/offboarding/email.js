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
export default async function emailOffboarding(placement) {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all([sendSOPOffboardingMail(mailInfo), sendITOffboardingMail(mailInfo)]);
    // write automation success to database
  } catch (error) {
    // write automation failure to database
  }
}
