/* eslint-disable no-param-reassign */
import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
import { getMailInfo } from '../helpers';

/**
 * @desc Automates developer onboarding on email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
const emailOnboarding = async (placement) => {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all([sendDevOnboardingMail(mailInfo), sendSOPOnboardingMail(mailInfo)]);
    // write automation success to database
  } catch (error) {
    // write automation failure to database
  }
};

export default emailOnboarding;
