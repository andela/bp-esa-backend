/* eslint-disable no-param-reassign */
import { sendDevOnboardingMail, sendSOPOnboardingMail } from '../../modules/email/emailModule';
/**
 * @desc Automates developer onboarding on email
 *
 * @param {object} placement Placement record whose developer is to be offboarded
 * @param {object} automationResult Result of automation job
 * @returns {void}
 */
const emailOnboarding = async (placement, automationResult) => {
  const {
    fellow, client_name: partnerName, start_date: startDate,
  } = placement;
  try {
    await sendDevOnboardingMail(fellow.email, fellow.name, partnerName);
    // eslint-disable-next-line max-len
    await sendSOPOnboardingMail(fellow.name, partnerName, fellow.email, fellow.location, 'Kenya', startDate);
    automationResult.emailAutomation = 'success';
  } catch (error) {
    automationResult.emailAutomation = 'failure';
  }
};

export default emailOnboarding;
