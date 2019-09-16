import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import env from '../../validator';

dotenv.config();

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUrl = process.env.GMAIL_REDIRECT_URL;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
const user = process.env.EMAIL_USER;
const testEmail = process.env.TEST_EMAIL_USER;
const testEmailPassword = process.env.TEST_EMAIL_PASSWORD;

const { OAuth2 } = google.auth;

const oath2Client = new OAuth2(clientId, clientSecret, redirectUrl);

oath2Client.setCredentials({
  refresh_token: refreshToken,
});

const accessToken = oath2Client.refreshAccessToken().then(res => res.credentials.access_token);


let mailConfig;
if (process.env.NODE_ENV === 'production') {
  mailConfig = {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
  };
} else {
  mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testEmail,
      pass: testEmailPassword,
    },
  };
}

const emailTransport = nodemailer.createTransport(mailConfig);

export default emailTransport;
