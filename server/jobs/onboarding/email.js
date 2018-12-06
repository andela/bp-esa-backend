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
const emailOnboarding = async (placement, automationResult) => {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all([sendDevOnboardingMail(mailInfo), sendSOPOnboardingMail(mailInfo)]);
    automationResult.emailAutomation = 'success';
  } catch (error) {
    automationResult.emailAutomation = error.message || 'failure';
  }
};

export default emailOnboarding;
