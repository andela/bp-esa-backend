require('dotenv').config();

const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN);

const getChannelID = async (name) => {
  const group_list = await web.groups.list();
  const target_group = group_list.groups.filter(g => g.name == name);
  const group_id = target_group[0].id;
  return group_id;
}

router.post('/staffed/:channel/:email',  (req, res) => {
  const channel = req.params.channel;
  const email = req.params.email;

  web.users.lookupByEmail({ token: process.env.SLACK_TOKEN, email: email })
  .then(async (result) => {
    const channel_id = await getChannelID(channel);
    web.groups.invite({
      token: process.env.SLACK_TOKEN,
      channel: channel_id,
      user: result.user.id
    })
    .then(arg => {
      res.send({
        invitation: result.user.real_name,
        channel: channel_id,
        user: result.user.id,
        message: "user invited to channel"
      });
    })
    .catch(error => {
      error: error
    });
  })
  .catch(error => {
    error: error
  });
});

router.post('/rolloff/:channel/:email', (req, res) => {
  const channel = req.params.channel;
  const email = req.params.email;
  web.users.lookupByEmail({
    token: process.env.SLACK_TOKEN,
    email: email
  })
  .then(async (result) => {
    const channel_id = await getChannelID(channel);
    web.groups.kick({
      token: process.env.SLACK_TOKEN,
      channel: channel_id,
      user: result.user.id
    }).
    then(mesg => {
      res.send({
        message: "user kicked from channel"
      });
    })
    .catch(error => {
      error: error
    })
  });
});

module.exports = router;