export const automationsMockData = [{
  id: 4,
  fellowName: 'Kelvin Kariuki',
  fellowId: '-KXGy1MT1oimjQgFimAd',
  partnerName: 'payoffsdfgh',
  partnerId: '-KXGyJcC1oimjQgFj184',
  type: 'onboarding',
  createdAt: '2019-01-14T19:16:35.453Z',
  updatedAt: '2019-01-14T19:16:35.453Z',
  emailAutomations: [
    {
      id: 1,
      emailTo: 'Who.User@example.com',
      subject: 'Onboarding',
      status: 'success',
    },
    {
      id: 2,
      emailTo: 'User.Unknown@example.com',
      subject: 'Onboarding',
      status: 'success',
    },
  ],
  slackAutomations:
    [{
      id: 10,
      status: 'success',
      statusMessage: 'kelvin.kariuki@andela.com invited to a channel',
      automationId: 4,
      channelId: 'GBQQ3C3V0',
      channelName: null,
      slackUserId: 'UE4910GEQ',
      type: 'invite',
      createdAt: '2019-01-14T19:16:38.696Z',
      updatedAt: '2019-01-14T19:16:38.696Z',
    },
    {
      id: 9,
      status: 'success',
      statusMessage: 'channel already exist',
      automationId: 4,
      channelId: null,
      channelName: 'p-payoffsdfgh',
      slackUserId: null,
      type: 'create',
      createdAt: '2019-01-14T19:16:38.647Z',
      updatedAt: '2019-01-14T19:16:38.647Z',
    },
    {
      id: 8,
      status: 'success',
      statusMessage: 'channel already exist',
      automationId: 4,
      channelId: null,
      channelName: 'p-payoffsdfgh-int',
      slackUserId: null,
      type: 'create',
      createdAt: '2019-01-14T19:16:37.534Z',
      updatedAt: '2019-01-14T19:16:37.534Z',
    },
    {
      id: 7,
      status: 'failure',
      statusMessage: 'An API error occurred: not_in_group',
      automationId: 4,
      channelId: 'GBQQ3C3V0',
      channelName: null,
      slackUserId: null,
      type: 'kick',
      createdAt: '2019-01-14T19:16:37.522Z',
      updatedAt: '2019-01-14T19:16:37.522Z',
    },
    {
      id: 6,
      status: 'success',
      statusMessage: 'kelvin.kariuki@andela.com invited to a channel',
      automationId: 4,
      channelId: 'GBRR4B5E3',
      channelName: null,
      slackUserId: 'UE4910GEQ',
      type: 'invite',
      createdAt: '2019-01-14T19:16:37.523Z',
      updatedAt: '2019-01-14T19:16:37.523Z',
    }],
  nokoAutomations:
    [{
      id: 2,
      status: 'failure',
      statusMessage: 'Request failed with status code 403',
      automationId: 4,
      nokoUserId: null,
      projectId: null,
      type: 'projectCreation',
      createdAt: '2019-01-14T19:16:36.492Z',
      updatedAt: '2019-01-14T19:16:36.492Z',
    }],
}];

export const expectedReponseMockData = [{
  id: 4,
  fellowId: '-KXGy1MT1oimjQgFimAd',
  fellowName: 'Kelvin Kariuki',
  partnerId: '-KXGyJcC1oimjQgFj184',
  partnerName: 'payoffsdfgh',
  type: 'onboarding',
  createdAt: '2019-01-14T19:16:35.453Z',
  updatedAt: '2019-01-14T19:16:35.453Z',
  slackAutomations:
    {
      status: 'failure',
      slackActivities:
        [{
          id: 10,
          channelId: 'GBQQ3C3V0',
          type: 'invite',
          status: 'success',
          slackUserId: 'UE4910GEQ',
          statusMessage: 'kelvin.kariuki@andela.com invited to a channel',
        },
        {
          id: 9,
          channelId: null,
          type: 'create',
          status: 'success',
          slackUserId: null,
          statusMessage: 'channel already exist',
        },
        {
          id: 8,
          channelId: null,
          type: 'create',
          status: 'success',
          slackUserId: null,
          statusMessage: 'channel already exist',
        },
        {
          id: 7,
          channelId: 'GBQQ3C3V0',
          type: 'kick',
          status: 'failure',
          slackUserId: null,
          statusMessage: 'An API error occurred: not_in_group',
        },
        {
          id: 6,
          channelId: 'GBRR4B5E3',
          type: 'invite',
          status: 'success',
          slackUserId: 'UE4910GEQ',
          statusMessage: 'kelvin.kariuki@andela.com invited to a channel',
        }],
    },
  emailAutomations: { status: 'failure', emailActivities: [] },
  nokoAutomations:
    {
      status: 'failure',
      nokoActivities:
        [{
          status: 'failure',
          statusMessage: 'Request failed with status code 403',
          type: 'projectCreation',
          nokoUserId: null,
          projectId: null,
        }],
    },
}];

export const automationCreateData = [
  {
    ...automationsMockData[0],
    fellowName: automationsMockData[0].fellowName.split(' ').join(),
    placementId: automationsMockData[0].id,
    email: automationsMockData[0].emailAutomations[0].emailTo,
  },
];
