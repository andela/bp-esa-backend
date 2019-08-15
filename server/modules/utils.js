const responseObject = (IdOfChannel, channelInfo, error, statusMessage, type) => ({
  slackUserId: null,
  channelId: IdOfChannel,
  channelName: channelInfo && channelInfo.channel.name,
  type,
  status: statusMessage,
  statusMessage: `${error.message}`,
});

export default responseObject;
