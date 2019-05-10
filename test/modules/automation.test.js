import sinon from 'sinon';
import { Op } from 'sequelize';
import { makeMockModels } from 'sequelize-test-helpers';
import proxyquire from 'proxyquire';

/* eslint-disable no-unused-expressions */

const mockModels = {
  SlackAutomation: {
    create: sinon.stub(),
    find: sinon.stub(),
    upsertById: sinon.stub(),
  },
  EmailAutomation: {
    upsertById: sinon.stub(),
  },
  FreckleAutomation: {
    upsertById: sinon.stub(),
  },
  Automation: {
    create: sinon.stub(),
  },
  Partner: {
    find: sinon.stub(),
    update: sinon.stub(),
    create: sinon.stub(),
  },
};

const fakeModels = makeMockModels(mockModels);

const automations = proxyquire('../../server/modules/automations', {
  '../models': fakeModels,
});

describe('Automation Database Operations', () => {
  it('should upsert a slackAutomation record in the DB', async () => {
    const automationDetails = {
      channelId: '555',
      // ...other properties...
    };
    await automations.createOrUpdateSlackAutomation(automationDetails);
    expect(mockModels.SlackAutomation.upsertById.calledWith(automationDetails)).to.be.true;
  });
  it('should upsert an emailAutomation record in the DB', async () => {
    const automationDetails = {
      automationId: '3',
      body:
        '<p><b>Developer Placement Notification</b></p>\n\n<p>\n  This is to notify you that mr smith, mr.smith@andela.com, Lagos,\n  has been placed with payoff,  .\n</p>\n\nTheir expected start date is not specified\n~~\nPlease do provide them with any support they need to ensure smooth transition to their Partner Engagement.\n\n\nRegards,\n\nSuccess',
      recipient: 'esarecipient@gmail.com',
      sender: 'esa@andela.com',
      subject: 'smith mr Placed with payoff',
      status: 'success',
      statusMessage: 'Email sent succesfully',
    };
    await automations.createOrUpdateEmailAutomation(automationDetails);
    expect(mockModels.EmailAutomation.upsertById.calledWith(automationDetails)).to.be.true;
    expect(mockModels.EmailAutomation.upsertById.firstCall.args[0].statusMessage).to.equal(
      'Email sent succesfully',
    );
  });
  it('should upsert a freckleAutomation record in the DB', async () => {
    const automationDetails = {
      projectId: '4444UFH',
    };
    await automations.createOrUpdateFreckleAutomation(automationDetails);
    expect(mockModels.FreckleAutomation.upsertById.calledWith(automationDetails)).to.be.true;
  });
});
