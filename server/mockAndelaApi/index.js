import express from 'express';
import faker from 'faker';
import mockPlacement from './mockPlacement';
import { slackClient } from '../modules/slack/slackIntegration';

const router = express.Router();

const { list } = slackClient.users;

/**
 * Generates random number of placements
 *
 * @param {String} status The status of the placement to generate
 *
 * @returns {Array} The list of placements generated
 */
async function generatePlacements(status) {
  const placements = [];
  const { members } = await list();
  const emails = members.reduce(
    (result, { deleted, profile: { email } }) => {
      return ((email && !deleted) ? [...result, email] : result);
    },
    [],
  );
  // max: 5, min: 1
  for (let index = 0; index < Math.floor(Math.random() * 5) + 1; index++) {
    placements.push(mockPlacement(status, emails[faker.random.number(emails.length - 1)]));
  }
  return placements;
}

router.get('/placements', async (req, res) => {
  const { status } = req.query;
  return res.status(200).json({ values: await generatePlacements(status) });
});

export default router;
