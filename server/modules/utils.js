const responseObject = (IdOfChannel, channelInfo, error, statusMessage) => (
  {
    slackUserId: null,
    channelId: IdOfChannel,
    channelName: channelInfo && channelInfo.channel.name,
    type: context,
    status: statusMessage,
    statusMessage: `${error.message}`,
  }
);

export default responseObject;
