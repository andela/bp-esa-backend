import { createOrUpdateEmailAutomation } from '../modules/automations';
import { sendPlacementFetchAlertEmail } from '../modules/email/emailModule';
import env from '../validator';

export const count = { FAILED_COUNT_NUMBER: 0 };

/**
 * @desc Retrieves necessary info. to be sent via email for any given placement
 * @param {object} placement A placement instance from allocation
 * @param {String} partnerLocation Location of the partner to be used in the automation
 * @returns {Promise} Promise to return info of the mail to be sent
 */
export const getMailInfo = (placement, partnerLocation) => {
  const {
    fellow: { name: developerName, email: developerEmail, location: developerLocation },
    client_name: partnerName,
    end_date: rollOffDate,
    start_date: dateStart,
  } = placement;
  return {
    developerName,
    partnerName,
    developerEmail,
    developerLocation,
    partnerLocation,
    rollOffDate,
    startDate: dateStart === '' ? 'not specified' : dateStart,
  };
};

/**
 * @desc Checks fail count then calls method to send failure email
 * @param {string} failCount Info about the number of times fetching placements has failed
 * @returns {Promise} Promise to return an email sent message object
 */
export const checkFailureCount = async (failCount) => {
  if (failCount >= parseInt(env.FETCH_FAIL_AUTOMATION_COUNT, 10)) {
    await sendPlacementFetchAlertEmail();
    return { message: 'Email sent successfully' };
  }
  return { message: 'Max failures not reached yet' };
};

/**
 * @desc Executes email functions for an email automation
 *
 * @param {Array} emailFunctions List of functions to execute for the automation
 * @param {Object} placement Placement data with which to execute automation
 * @param {String} location Location of partner used in the automation
 * @param {String} automationId Id of the automation being carried out
 *
 * @returns {void}
 */
export async function executeEmailAutomation(emailFunctions, placement, location, automationId) {
  const mailInfo = await getMailInfo(placement, location);
  const emailAutomations = await Promise.all(emailFunctions.map(func => func(mailInfo)));
  await Promise.all(
    emailAutomations.map(automationData => createOrUpdateEmailAutomation({ ...automationData, automationId })),
  );
}
