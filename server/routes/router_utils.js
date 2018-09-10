const { WebClient } = require('@slack/client');
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const web = new WebClient(SLACK_TOKEN);
const core_channels = require('./core_channels');

const getChannelID = async (slack_token, name) => {
  try {
    const group_list = await web.groups.list({
      token: slack_token
    });
    // return group_list;
    const group_names = {}
    group_list.groups.forEach(this_group => group_names[this_group.name] = this_group.id);
    if (group_names.hasOwnProperty(name)) {
      return new Promise((resolve) => resolve(group_names[name]))
    } 
    else {
      return new Promise((reject) => reject(new Error(`The channel ${name} does not exist`)));
    }   
  } catch (err) {
    return(err.message); 
  } 
}

const userExists = async (slack_token, user_id, channel_id) => {
  const group_object = await web.groups.info({
    token: slack_token,
    channel: channel_id
  });
  return (group_object.group.members.indexOf(user_id) > -1) ? true : false;
}

const remove_from_channel = async (slack_token, user_info_result_obj, channel_id) => {
  const user_exists = await userExists(slack_token, user_info_result_obj.user.id, channel_id);
  if (user_exists) {
    return web.groups.kick({
      token: slack_token,
      channel: channel_id,
      user: user_info_result_obj.user.id
    });
  }
  return Promise.reject(`User ${user_info_result_obj.user.profile.email} not in one of the required channels`);
}

const invite_to_channel = async (slack_token, user_info_result_obj, channel_id) => {
  const user_exists = await userExists(slack_token, user_info_result_obj.user.id, channel_id);
  if (!user_exists) {
    return web.groups.invite({
      token: slack_token,
      channel: channel_id,
      user: user_info_result_obj.user.id
    });
  }
  return;
}

const searchUserByEmail = (email, slack_token) => {
  return new Promise((resolve, reject) => {
    try {
      const user =  web.users.lookupByEmail({ token: slack_token, email: email });
      resolve(user);
    } catch (err) {
      reject(err);
    }
  })
}

const staffing_slack_operation = async (slack_token, user_info_result_obj, partner_channel_name) => {
  // Get channels to add user to or remove them from
  const partner_channel_id = await getChannelID(slack_token, partner_channel_name);
  const available_devs_channel_id = await getChannelID(slack_token, core_channels.AVAILABLE_DEVS);
  const placed_ops_channel_id = await getChannelID(slack_token, core_channels.PLACED_OPS);
  const rack_city_channel_id = await getChannelID(slack_token, core_channels.RACK_CITY);

  return Promise.all([
    // Kick of user from available-devs channel
    remove_from_channel(slack_token, user_info_result_obj, available_devs_channel_id),

    // Invite user to p-partner channel
    invite_to_channel(slack_token, user_info_result_obj, partner_channel_id),

    // Invite user to rack-city
    invite_to_channel(slack_token, user_info_result_obj, rack_city_channel_id),

    // Invite to placed-fellows-ops
    invite_to_channel(slack_token, user_info_result_obj, placed_ops_channel_id)
  ])
}

const rolloff_slack_operation = async (slack_token, user_info_result_obj, partner_channel_name) => {
  // Get channels to add user to or remove them from
  const partner_channel_id = await getChannelID(slack_token, partner_channel_name);
  const available_devs_channel_id = await getChannelID(slack_token, core_channels.AVAILABLE_DEVS);

  return Promise.all([
    // Kick of user from p-partner channel
    remove_from_channel(slack_token, user_info_result_obj, partner_channel_id),

    // Invite user to available-devs channel
    invite_to_channel(slack_token, user_info_result_obj, available_devs_channel_id)
  ])
}

export { 
  getChannelID, 
  searchUserByEmail, 
  staffing_slack_operation, 
  rolloff_slack_operation
};