const { WebClient } = require('@slack/client');
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const web = new WebClient(SLACK_TOKEN);

const getChannelID = async (slack_token, name) => {
  const group_list = await web.groups.list({
    token: slack_token
  });
  const target_group = group_list.groups.filter(g => g.name == name);
  const group_id = target_group[0].id;
  return group_id;
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
  return
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
  return
}

export { getChannelID, invite_to_channel, remove_from_channel };