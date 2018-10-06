/* eslint no-eval: 0 */
/* eslint no-unused-vars: 0 */
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const { OAuth2 } = google.auth;

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUrl = process.env.GMAIL_REDIRECT_URL;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
const user = process.env.EMAIL_USER;
const opsEmail = process.env.OPS_EMAIL;

const oath2Client = new OAuth2(clientId, clientSecret, redirectUrl);

const developerOnboardingTemplatePath = path.join(__dirname, 'developer-onboarding-email.html');
const successOnboardingTemplatePath = path.join(__dirname, 'success-onboarding-email.html');


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

export const developerEmailTransport = (developerEmail, developerName, partnerName) => {
  const mailOptions = {
    from: user,
    to: developerEmail,
    subject: `${partnerName} Engagement Support`,
    generateTextFromHTML: true,
    html: eval(`\`${fs.readFileSync(developerOnboardingTemplatePath).toString()}\``),
  };

  return emailTransport.sendMail(mailOptions);
};

export const opsEmailTransport = (
  developerEmail,
  developerName,
  develperLocation,
  partnerName,
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

  return emailTransport.sendMail(mailOptions);
};
