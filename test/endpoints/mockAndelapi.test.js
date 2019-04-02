import chaiHttp from 'chai-http';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai, { expect } from 'chai';
import app from '../../server';
import slackMocks from '../mocks/slack';

const getSlackAutomation = sinon.stub();

const slack = proxyquire('../../server/modules/slack/slackIntegration', {
  '../automations': {
    getSlackAutomation,
  },
});

const fakeSlackClient = {
  lookupByEmail: sinon
    .stub(slack.slackClient.users, 'lookupByEmail')
    .callsFake(() => slackMocks.slackUser),
  fakeUserList: sinon.stub(slack.slackClient.users, 'list').resolves(slackMocks.userList),
  invite: sinon.stub(slack.slackClient.groups, 'invite').callsFake(() => slackMocks.inviteUser),
  kick: sinon.stub(slack.slackClient.groups, 'kick').callsFake(() => slackMocks.removeUser),
  create: sinon.stub(slack.slackClient.groups, 'create').callsFake(() => slackMocks.createGroups),
  groupInfo: sinon.stub(slack.slackClient.groups, 'info').callsFake(() => slackMocks.groupInfo),
};

chai.use(chaiHttp);
describe('Tests for mockAndelaApi endpoint\n', () => {
  afterEach(() => {
    Object.keys(fakeSlackClient).forEach(fake => fakeSlackClient[fake].resetHistory());
    getSlackAutomation.resetHistory();
  });

  it('Should return list of mock placements with a 200 status code', (done) => {
    const status = 'External Engagements - Rolling Off';
    chai
      .request(app)
      .get(`/mock-api/placements?status=${status}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('values')
          .to.be.an('array');
        const { values } = res.body;
        expect(values.length > 0).to.equal(true);
        expect(values.length < 4).to.equal(true);
        expect(values[0])
          .to.have.property('status')
          .to.equal(status);
        expect(values[0])
          .to.be.an('object')
          .to.have.keys([
            'client_id',
            'client_name',
            'created_at',
            'end_date',
            'engagement_id',
            'engagement_role',
            'engagement_role_id',
            'fellow',
            'fellow_id',
            'id',
            'next_available_date',
            'placement_mode',
            'salesforce_id',
            'start_date',
            'status',
            'sync_status',
            'type',
            'updated_at',
            'updated_by',
          ]);
        done();
      });
  });
});
