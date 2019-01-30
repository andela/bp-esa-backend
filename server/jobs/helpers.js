import fs from 'fs';
import path from 'path';
import { findPartnerById } from '../modules/allocations';
import emailTransport from '../modules/email/emailTransport';
import constructMailOptions from '../modules/email/emailModule';

const getEmailTemplate = emailTemplate => path.join(__dirname, `../modules/email/emailTemplates/${emailTemplate}`);
let number = 1;

/**
 * @desc Retrieves necessary info. to be sent via email for any given placement
 * @param {oject} placement A placement instance from allocation
 * @returns {object} Mail info to be sent
 */
export const getMailInfo = async (placement) => {
  const {
    fellow: { name: developerName, email: developerEmail, location: developerLocation },
    client_name: partnerName,
    client_id: partnerId,
    end_date: rollOffDate,
    start_date: dateStart,
  } = placement;
  const { location: partnerLocation } = await findPartnerById(partnerId);
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
 * @desc increases fail count by one
 * @returns {Number} fail number count
 */
/* istanbul ignore next */
export const increaseFailCount = () => {
  number += 1;
  process.env.FAIL_COUNT = number;
  return number;
};

/**
 * @function sendPlacementFetchEmail
 * @desc Send email to ESA if fetching placements fails constantly
 * @param {string} receiver Info about the mail to be sent
 *
 * @returns {Object} Fail status if the operation fails
 */
const sendPlacementFetchAlertEmail = (receiver) => {
  try {
    const mailOptions = constructMailOptions({
      sendTo: receiver,
      emailSubject: 'Allocations placement data error',
      // eslint-disable-next-line no-eval
      emailBody: eval(`\`${fs.readFileSync(getEmailTemplate('placement-fail-email.html')).toString()}\``),
    });
    emailTransport.sendMail(mailOptions);
  } catch (error) {
    return { status: 'fail', message: error };
  }
};
/**
 * @desc Checks fail count then calls method to send failure email
 * @param {string} failCount Info about the number of times fetching placements has failed
 * @returns {Object} message about email being sent
 */
export const checkFailureCount = (failCount) => {
  // eslint-disable-next-line radix
  if (failCount >= parseInt(process.env.RESTART_TIME)) {
    sendPlacementFetchAlertEmail(process.env.SUPPORT_EMAIL);
    return { message: 'Email sent successfully' };
  }
};

/**
 * @desc Executes email functions for an email automation
 *
 * @param {Array} emailFunctions List of functions to execute for the automation
 * @param {Object} placement Placement data with which to execute automation
 *
 * @returns {void}
 */
export async function executeEmailAutomation(emailFunctions, placement) {
  try {
    const mailInfo = await getMailInfo(placement);
    await Promise.all(emailFunctions.map(func => func(mailInfo)));
    // write automation success to database
  } catch (error) {
    // write automation failure to database
  }
}
