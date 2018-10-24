const slackMocks = {
  createGroups: {
    createGeneral: {
      ok: true,
      group: {
        id: 'GDL7RDC5V',
        name: 'p-sample-partner',
        is_group: true,
        created: 1540194427,
        creator: 'UDECYD0LQ',
        is_archived: false,
        name_normalized: 'sample-channel',
        is_mpim: false,
        is_open: true,
        last_read: '0000000000.000000',
        latest: null,
        unread_count: 0,
        unread_count_display: 0,
        members: [
          'UDECYD0LQ',
        ],
        topic: {
          value: '',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value: '',
          creator: '',
          last_set: 0,
        },
        priority: 0,
      },
      warning: 'missing_charset',
      response_metadata: {
        warnings: [
          'missing_charset',
        ],
      },
    },
    createInternal: {
      ok: true,
      group: {
        id: 'GEY7RDC5V',
        name: 'p-sample-partner-int',
        is_group: true,
        created: 1540194427,
        creator: 'UDECYD0LQ',
        is_archived: false,
        name_normalized: 'sample-channel-2',
        is_mpim: false,
        is_open: true,
        last_read: '0000000000.000000',
        latest: null,
        unread_count: 0,
        unread_count_display: 0,
        members: [
          'UDECYD0LQ',
        ],
        topic: {
          value: '',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value: '',
          creator: '',
          last_set: 0,
        },
        priority: 0,
      },
      warning: 'missing_charset',
      response_metadata: {
        warnings: [
          'missing_charset',
        ],
      },
    },
    createDuplicate: {
      data: {
        ok: false,
        error: 'name_taken',
        scopes: [],
        acceptedScopes: [],
      },
    },
  },
};

export default slackMocks;
