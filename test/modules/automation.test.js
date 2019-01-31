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
  it('should get a slackAutomation record from the DB', async () => {
    const automationDetails = {
      slackAutomationId: '99',
      channelName: 'p-test',
      // ...other properties...
    };
    await automations.getSlackAutomation(automationDetails);
    expect(
      mockModels.SlackAutomation.find.calledWith({
        where: {
          [Op.or]: [
            { id: automationDetails.slackAutomationId },
            { channelName: automationDetails.channelName },
          ],
        },
      }),
    ).to.be.true;
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
    await automations.createOrUpdateEmaillAutomation(automationDetails);
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
  it('should get a partner record from the DB', async () => {
    const partnerId = '-UTF56K';
    await automations.getPartnerRecord(partnerId);
    expect(mockModels.Partner.find.calledWith({ where: { partnerId } })).to.be.true;
  });
  it('should create or update a partner record in database', async () => {
    const partner = {
      name: 'Facebook Inc',
      partnerId: 'JKb533jksdf_iu34',
      freckleProjectId: '349icnioj3in_23',
      slackChannels: {
        internal: 'facebook-int',
        general: 'facebook',
      },
    };
    await automations.creatOrUpdatePartnerRecord(partner);
    expect(mockModels.Partner.find.calledWith({ where: { partnerId: partner.partnerId } })).to.be
      .true;
    expect(mockModels.Partner.create.calledWith(partner)).to.be.true;
  });
});
