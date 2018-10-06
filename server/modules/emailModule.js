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
    html: `
      <p><b>To: ${developerEmail}</b></p>
      <p><b>Subject: ${partnerName} Engagement Support</b></p>

      
      <p><b>Hello ${developerName},</b></p>

      <p>
        You have recently been staffed with  ${partnerName}. In order to ensure you are well 
        supported as you start this journey with your Partner, please take note of the following:
      </p>

      <p>
        You will be added to the  below Slack Channels:
        <ul>
          <li>#p-${partnerName}</li>
          <li>#rack-city</li>
        </ul>
      </p>

      <p>
        You will also be removed from the below slack channel:
        <ul>
          <li>#available-developers</li>
        </ul>
      </p>

      <p>
        As you prepare to kick off your engagement:
        <ul>
          <li>Set a 1:1 session with your TSM</li>
          <li>
            Review the 
            <a href="https://docs.google.com/document/d/12hW3um2b2peDMjszNoL0_0o5r0ILwvb7qX8fcSXnoUE/edit">
              Developer Partner Engagement Guide
            </a>
          </li>
          <li>
            If you are based out of the Nairobi, Kampala offices, please fill out this 
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScOP-Jpu-baEJEmsvHX70V4mg6387RtKWxcfF4LcG5yCXbZGA/viewform">
              Operations Support form.
            </a>
            Filling this form will help the Operations teams in your locations to provide you with the needed support
            (Meals and Transport).
          </li>
          <li>
            If you are based out of Lagos Office, please familiarise yourself with the 
            <a href="https://sites.google.com/andela.com/success/success-policies-initiatives/stipend-for-developers-working-with-partners-after-hours?authuser=2&pli=1">
              Stipend Policy for Placed Developers.
            </a>
          </li>
        </ul>
      </p>

      <p><b>Best of Luck.</b></p>
      <p><b>Regards</b></p>
    `,
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
    html: `
      <p><b>To: ${opsEmail} , Kampala Ops</b></p>

      <p><b>Subject: ${developerName} Placed with ${partnerName}</b></p>
      
      <p><b>Developer Placement Notification</b></p>
      
      <p>
        This is to notify you that ${developerName}, ${developerEmail}, ${develperLocation},
        has been placed with ${partnerName} ,${partnerLocation}.
      </p>
      
      <p>Their expected start date is ${startDate}</p>
      <p>
        Please do provide them with any support they need to ensure smooth transition to their 
        Partner Engagement.
      </p>
      
      
      <p><b>Regards,</b></p>
      
      <p><b>Success</b></p>
      
    `,
  };

  return emailTransport.sendMail(mailOptions);
};
