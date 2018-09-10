require('dotenv').config();

const express = require('express');
const router = express.Router();
const SLACK_TOKEN = process.env.SLACK_TOKEN;

import { 
  getChannelID, 
  searchUserByEmail, 
  staffing_slack_operation,
  rolloff_slack_operation,
} from './router_utils';

router.post('/staffed', async (req, res) => {

  if (!req.body.emails instanceof Array) {
    req.body.emails = new Array(req.body.email);
  }

  const channel_name = req.body.channel;
  const user_emails = req.body.emails;

  try {
    const channel_id = await getChannelID(SLACK_TOKEN, channel_name)
    if (channel_id instanceof Error) {
      throw new Error(`API Error`)
    }

    Promise.all(
      user_emails.map(async (this_email) => {
        return searchUserByEmail(this_email, SLACK_TOKEN)
      })
    ).then(values => {
      // res.send({ data: values }) 
      Promise.all(
        values.map(async (this_user) => {
          return staffing_slack_operation(SLACK_TOKEN, this_user, channel_name)
        })
      ).then(values => {
        // res.send({ values: values });
        res.send({ success: "Operational completed successfully for all the specified users"})
        return
      }).catch(err => {
        res.send({ error: err.message + ' : Error while removing or adding user(s) to channels' })
        return
      })
    }).catch(err => {
      res.send({ error: err.message });
      return;
    })
  } catch(err) {
    res.send({ error: err.message + ` : The channel ${channel_name} does not exist`});
    return;
  }
  
});

router.post('/rolloff', async (req, res) => {

  if (!req.body.email instanceof Array) {
    req.body.email = new Array(req.body.email);
  }

  const channel_name = req.body.channel;
  const user_emails = req.body.email;

  try {
    const channel_id = await getChannelID(SLACK_TOKEN, channel_name)
    if (channel_id instanceof Error) {
      throw new Error(`API Error`)
    }

    Promise.all(
      user_emails.map(async (this_email) => {
        return searchUserByEmail(this_email, SLACK_TOKEN)
      })
    ).then(values => {
      // res.send({ data: values }) 
      Promise.all(
        values.map(async (this_user) => {
          return rolloff_slack_operation(SLACK_TOKEN, this_user, channel_name)
        })
      ).then(values => {
        // res.send({ values: values });
        res.send({ success: "Operational completed successfully for all the specified users"})
        return
      }).catch(values => {
        res.send({ error: values + ' : Error while removing or adding user(s) to channels' })
        return
      })
    }).catch(err => {
      res.send({ error: err.message });
      return;
    })
  } catch(err) {
    res.send({ error: err.message + ` : The channel ${channel_name} does not exist`});
    return;
  }

});

module.exports = router;
