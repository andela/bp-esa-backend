import { WebClient } from '@slack/client';
import dotenv from 'dotenv';

dotenv.config();

const slack_web = new WebClient(process.env.SLACK_TOKEN);

const channels_to_invite_to = [
  {
    name: 'placed-developers',
    id: 'GBRR5TPD5',
  },
  {
    name: 'rack-city',
    id: 'GBRR4B5E3',
  },
];

const onboarding_channel_ids = channels_to_invite_to.map(channel => channel.id);

export { slack_web, onboarding_channel_ids };
