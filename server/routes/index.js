require('dotenv').config();

const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/client');
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const core_channels = require('./core_channels');

const web = new WebClient(SLACK_TOKEN);

import { getChannelID, invite_to_channel, remove_from_channel } from './router_utils';

router.get('/staffed/:channel/:email', async (req, res) => {
  const channel_name = req.params.channel;
  const email = req.params.email;

  web.users.lookupByEmail({
      token: SLACK_TOKEN,
      email: email
    })
    .then(async (result) => {

      try {
        // proceed only if the channel sent using the request exists
        var partner_channel_id = await getChannelID(SLACK_TOKEN, channel_name);
      } catch (err) {
        const err = new Error('the partner channel does not exist');
        res.status(500).send({
          error: "The partner channel doesn't exist"
        });
      }

      // const partner_channel_id = await getChannelID(channel_name);

      const available_devs_channel_id = await getChannelID(SLACK_TOKEN, core_channels.AVAILABLE_DEVS);
      const placed_ops_channel_id = await getChannelID(SLACK_TOKEN, core_channels.PLACED_OPS);
      const rack_city_channel_id = await getChannelID(SLACK_TOKEN, core_channels.RACK_CITY);

      try {
        const response = await Promise.all(
          [
            // Kick of user from available-devs channel
            remove_from_channel(SLACK_TOKEN, result, available_devs_channel_id),

            // Invite user to p-partner channel
            invite_to_channel(SLACK_TOKEN, result, partner_channel_id),

            // Invite user to rack-city
            invite_to_channel(SLACK_TOKEN, result, rack_city_channel_id),

            // Invite to placed-fellows-ops
            invite_to_channel(SLACK_TOKEN, result, placed_ops_channel_id)
          ]
        ).then(result => {
          console.log(result)
          res.send({ success: "User invited to and removed from all required channels" });
        })
      } catch (err) {
        console.log("error thrown")
        console.log(err)
        res.status(500).send({ error: "An err occurred while removing and inviting user to channels" });
        return
      }

    }).catch(error => {
      res.status(404).send({ error: "Could not find user specified by the email"})
    });
});

router.get('/rolloff/:channel/:email', (req, res) => {
  const channel_name = req.params.channel;
  const email = req.params.email;

  web.users.lookupByEmail({ token: SLACK_TOKEN, email: email })
    .then(async (result) => {

      try {
        // proceed only if the channel sent using the request exists
        var partner_channel_id = await getChannelID(SLACK_TOKEN, channel_name);
      } catch (err) {
        const err = new Error('the partner channel does not exist');
        res.status(500).send({
          error: "The partner channel doesn't exist"
        });
      }

      // Get channel IDs to add to or remove user from
      const available_devs_channel_id = await getChannelID(SLACK_TOKEN, core_channels.AVAILABLE_DEVS);

      try {
        const response = await Promise.all(
          [
            // Kick of user from p-partner channel
            remove_from_channel(SLACK_TOKEN, result, partner_channel_id),

            // Invite user to available-devs channel
            invite_to_channel(SLACK_TOKEN, result, available_devs_channel_id),
          ]
        ).then(result => {
          console.log(result)
          res.send({ success: "User invited to and removed from all required channels" });
        })
      } catch (err) {
        console.log("error thrown")
        console.log(err)
        res.status(500).send({ error: "An err occurred while removing and inviting user to channels" });
        return
      }

    })
    .catch(error => {
      res.status(404).send({
        error: "Could not find the user specified by the email"
      })
    });
});

module.exports = router;
