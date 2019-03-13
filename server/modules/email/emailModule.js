import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import emailTransport from './emailTransport';
import { createOrUpdateEmaillAutomation } from '../automations';

dotenv.config();

const user = process.env.EMAIL_USER;
const opsEmail = process.env.OPS_EMAIL;
const itEmail = process.env.IT_EMAIL;
const supportEmail = process.env.SUPPORT_EMAIL;

const getEmailTemplatePath = emailTemplate => path.join(__dirname, `emailTemplates/${emailTemplate}`);
const developerOnboardingTemplatePath = getEmailTemplatePath('developer-onboarding-email.html');
const successOnboardingTemplatePath = getEmailTemplatePath('success-onboarding-email.html');
const itOffboardingPath = getEmailTemplatePath('it-offboarding-email.html');
const successOffboardingTemplatePath = getEmailTemplatePath('success-offboarding-email.html');
const placementFailedTemplatePath = getEmailTemplatePath('placement-fail-email.html');

/**
 * @func sendAndSaveMail
 * @desc Send an email then save details about the email as emailAutomation in the DB.
 *
 * @param {object} mailOptions The mail options.
 * @returns {undefined}
 */
const sendAndSaveMail = async (mailOptions) => {
  const data = {
    automationId: process.env.AUTOMATION_ID,
    body: mailOptions.html,
    recipient: mailOptions.to,
    sender: mailOptions.from,
    subject: mailOptions.subject,
    status: 'success',
    statusMessage: 'Email sent succesfully',
  };
  try {
    await emailTransport.sendMail(mailOptions);
    await createOrUpdateEmaillAutomation(data);
  } catch (error) {
    data.status = 'failure';
    data.statusMessage = error.message;
    await createOrUpdateEmaillAutomation(data);
  }
};

/**
 * @func constructMailOptions
 * @desc An helper to help construct the mail options to be passed to the mail transport.
 *
 * @param {object} options The options to be added to the default options.
 * @param {string} options.htmlString The email in HTML format
 * @param {string} options.sendTo The email address of the recipient
 * @param {string} options.emailSubject The subject of the email
 *
 * @returns {object} The mail options
 */
const constructMailOptions = ({ emailBody, sendTo, emailSubject }) => ({
  from: user,
  to: sendTo,
  subject: emailSubject,
  generateTextFromHTML: true,
  html: emailBody,
});
/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */

/**
 * @function sendDevOnboardingMail
 * @desc A function to help send email to a developer about an onboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerName Name of the developer onboarded
 * @param {string} mailInfo.developerEmail Email of the developer onboarded
 * @param {string} mailInfo.partnerName Name of the partner
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendDevOnboardingMail = async (mailInfo) => {
  const { developerEmail, developerName, partnerName } = mailInfo;

  const mailOptions = constructMailOptions({
    sendTo: developerEmail,
    emailSubject: `${partnerName} Engagement Support`,
    emailBody: eval(`\`${fs.readFileSync(developerOnboardingTemplatePath).toString()}\``),
  });
  await sendAndSaveMail(mailOptions);
};

/**
 * @function sendITOffboardingMail
 * @desc A function to help send email to IT about an offboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerName Name of the developer offboarded
 * @param {string} mailInfo.developerEmail Email of the developer offboarded
 * @param {string} mailInfo.developerLocation Location of developer offboarded
 * @param {string} mailInfo.rollOffDate The roll off date
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendITOffboardingMail = async (mailInfo) => {
  const {
    developerName, developerEmail, developerLocation, rollOffDate,
  } = mailInfo;

  const mailOptions = constructMailOptions({
    sendTo: itEmail,
    emailSubject: `${developerName} Engagement Roll Off (${developerLocation})`,
    emailBody: eval(`\`${fs.readFileSync(itOffboardingPath).toString()}\``),
  });
  await sendAndSaveMail(mailOptions);
};

/**
 * @function sendSOPOnboardingMail
 * @desc A function to help send email to success-ops about an onboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerName Name of the developer onboarded
 * @param {string} mailInfo.developerEmail Email of the developer onboarded
 * @param {string} mailInfo.developerLocation Location of developer onboarded
 * @param {string} mailInfo.partnerName Name of the partner
 * @param {stirng} mailInfo.parnerLocation Location of partner
 * @param {string} mailInfo.startDate The placement start date
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendSOPOnboardingMail = async (mailInfo) => {
  const {
    developerName,
    developerEmail,
    developerLocation,
    partnerName,
    partnerLocation,
    startDate,
  } = mailInfo;

  const mailOptions = constructMailOptions({
    sendTo: opsEmail,
    emailSubject: `${developerName} Placed with ${partnerName}`,
    emailBody: eval(`\`${fs.readFileSync(successOnboardingTemplatePath).toString()}\``),
  });
  await sendAndSaveMail(mailOptions);
};

/**
 * @function sendSOPOnboardingMail
 * @desc A function to help send email to success-ops about an offboarding placement.
 *
 * @param {object} mailInfo Info about the mail to be sent
 * @param {string} mailInfo.developerName Name of the developer offboarding
 * @param {string} mailInfo.developerEmail Email of the developer offboarding
 * @param {string} mailInfo.developerLocation Location of developer offboarding
 * @param {string} mailInfo.partnerName Name of the partner
 * @param {stirng} mailInfo.parnerLocation Location of partner
 * @param {string} mailInfo.rollOffDate The roll off date
 *
 * @returns {object} The result of sending the mail.
 * @throws Will throw an error if sending email fails.
 */
export const sendSOPOffboardingMail = async (mailInfo) => {
  const {
    developerName,
    developerEmail,
    developerLocation,
    partnerName,
    partnerLocation,
    rollOffDate,
  } = mailInfo;

  const mailOptions = constructMailOptions({
    sendTo: opsEmail,
    emailSubject: `${developerName} Placed with ${partnerName}`,
    emailBody: eval(`\`${fs.readFileSync(successOffboardingTemplatePath).toString()}\``),
  });
  await sendAndSaveMail(mailOptions);
};

/**
 * @function sendPlacementFetchAlertEmail
 * @desc Send email to ESA if fetching placements fails constantly
 * @returns {Object} Fail status if the operation fails
 */
export const sendPlacementFetchAlertEmail = async () => {
  try {
    const mailOptions = constructMailOptions({
      sendTo: supportEmail,
      emailSubject: 'Allocations placement data error',
      emailBody: eval(`\`${fs.readFileSync(placementFailedTemplatePath).toString()}\``),
    });
    await emailTransport.sendMail(mailOptions);
    return { status: 'success', message: `Successfully sent email to ${supportEmail} ` };
  } catch (error) {
    return { status: 'fail', message: error };
  }
};

export default constructMailOptions;
