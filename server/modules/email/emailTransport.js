import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUrl = process.env.GMAIL_REDIRECT_URL;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
const user = process.env.EMAIL_USER;

const { OAuth2 } = google.auth;

const oath2Client = new OAuth2(clientId, clientSecret, redirectUrl);

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

export default emailTransport;
