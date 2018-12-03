/* eslint no-eval: 0 */
/* eslint no-unused-vars: 0 */
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

import response from '../../helpers/response';

dotenv.config();

const { OAuth2 } = google.auth;

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUrl = process.env.GMAIL_REDIRECT_URL;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
const user = process.env.EMAIL_USER;
const opsEmail = process.env.OPS_EMAIL;
const itEmail = process.env.IT_EMAIL;

const oath2Client = new OAuth2(clientId, clientSecret, redirectUrl);

const getEmailTemplatePath = emailTemplate => path.join(__dirname, `emailTemplates/${emailTemplate}`);

const developerOnboardingTemplatePath = getEmailTemplatePath('developer-onboarding-email.html');
const successOnboardingTemplatePath = getEmailTemplatePath('success-onboarding-email.html');
const itOffboardingPath = getEmailTemplatePath('it-offboarding-email.html');
const successOffboardingTemplatePath = getEmailTemplatePath('success-offboarding-email.html');

oath2Client.setCredentials({
  refresh_token: refreshToken,
});

const accessToken = oath2Client.refreshAccessToken().then(res => res.credentials.access_token);

const emailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user,
    clientId,
    clientSecret,
    refreshToken,
    accessToken,
  },
});

const sendMail = async (mailOptions) => {
  try {
    await emailTransport.sendMail(mailOptions);
    return response(false, 'email sent successfully');
  } catch (error) {
    return response(true, error.message);
  }
};

export const developerEmailTransport = (developerEmail, developerName, partnerName) => {
  const mailOptions = {
    from: user,
    to: developerEmail,
    subject: `${partnerName} Engagement Support`,
    generateTextFromHTML: true,
    html: eval(`\`${fs.readFileSync(developerOnboardingTemplatePath).toString()}\``),
  };

  return sendMail(mailOptions);
};

export const opsEmailTransport = (
  developerName,
  partnerName,
  developerEmail,
  developerLocation,
  partnerLocation,
  startDate,
) => {
  const mailOptions = {
    from: user,
    to: opsEmail,
    subject: `${developerName} Placed with ${partnerName}`,
    generateTextFromHTML: true,
    html: eval(`\`${fs.readFileSync(successOnboardingTemplatePath).toString()}\``),
  };

  return sendMail(mailOptions);
};

/**
 * @desc Sends an email to IT to wipe the machine of the developer
 *
 * @param {any} developerName Name of the roller off developer
 * @param {any} developerEmail Email of the developer
 * @param {any} developerLocation Location of the developer: Lagos || Nairobi || Kampala
 * @param {any} rollOffDate Date the developer rolled off
 *
 * @returns {Promise} Promise which resolves to success message or error if email fails
 */
export const itEmailTransport = (developerName, developerEmail, developerLocation, rollOffDate) => {
  const mailOptions = {
    from: user,
    to: itEmail,
    subject: `Subject: ${developerName} Engagement Roll Off (${developerLocation})`,
    generateTextFromHTML: true,
    html: eval(`\`${fs.readFileSync(itOffboardingPath).toString()}\``),
  };
  return sendMail(mailOptions);
};

/**
 * Function for sending email to the success offboarding department
 *
 * @param {string} developerName - Name of developer offboarding
 * @param {string} parnerName - Name of partner
 * @param {string} developerEmail - Email of the developer
 * @param {string} developerLocation - location of developer
 * @param {string} rollOffDate - date for developer to roll off
 *
 * @returns {object}  Promise
 */
export const opsOffBoardingEmailTransport = (...args) => {
  const [
    developerName,
    partnerName,
    developerEmail,
    developerLocation,
    rollOffDate,
  ] = args;
  const mailOptions = {
    from: user,
    to: opsEmail,
    subject: `${developerName} Placed with ${partnerName}`,
    generateTextFromHTML: true,
    html: eval(`\`${fs.readFileSync(successOffboardingTemplatePath).toString()}\``),
  };

  return sendMail(mailOptions);
};
