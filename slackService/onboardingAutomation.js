import { 
  slack_web,
  onboarding_channel_ids,
} from './setup';

const validate_email = (email) => /^.+?@.+?\..+$/.test(email);

const get_user_id = async (slack_web, user_email) => {
  // Required Scope: users:read, users:read.email
  let user_id;
  await slack_web.users.lookupByEmail({ email: user_email })
    .then((res) => {
      user_id = res.user.id;
    });
  return user_id;
};

const add_user_to_channel = (slack_web, user_id, channel_id) => {
  // Required Scope: groups:write
  return slack_web.groups.invite({ channel: channel_id, user: user_id });
};

const add_user_to_multiple_channels = async (slack_web, user_id, channel_ids) => {
  return new Promise((resolve, reject) => {
    channel_ids.forEach(async (channel_id, index) => {
      await add_user_to_channel(slack_web, user_id, channel_id);
      if ((index + 1) === channel_ids.length) {
        resolve(1);
      }
    });
  });
};

const onboarding_automation = async (user_email) => {
  try {
    if (!validate_email(user_email)) {
      throw new Error('Email format is not valid');
    };
    const user_id = await get_user_id(slack_web, user_email);
    await add_user_to_multiple_channels(slack_web, user_id, onboarding_channel_ids);
    // The result of this transaction can be written into the database
  } catch (err) {
    console.log('Slack Service Error: ', err.message);
    // The error from this transaction can be written into the database
  };
};

export default onboarding_automation;
