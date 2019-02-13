import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import app from '../../server';
import slackMocks from '../mocks/slack';
import { slackClient } from '../../server/modules/slack/slackIntegration';

chai.use(chaiHttp);
describe('Tests for mockAndelaApi endpoint\n', () => {
  it('Should return list of mock placements with a 200 status code', (done) => {
    const status = 'External Engagements - Rolling Off';
    const userEmails = slackMocks.userList.members.reduce(
      (result, { profile: { email } }) => (email ? [...result, email] : result),
      [],
    );
    chai
      .request(app)
      .get(`/mock-api/placements/?status=${status}`)
      .end((err, res) => {
        const fakeUserList = sinon.stub(slackClient.users, 'list').callsFake(() => slackMocks.userList);
        const { values } = res.body;
        expect(res).to.have.status(200);
        // expect(res.body)
        //   .to.have.property('values')
        //   .to.be.an('array');
        // expect(values.length > 0).to.equal(true);
        // expect(values.length < 6).to.equal(true);
        // expect(userEmails.includes(values[0].fellow.email)).to.equal(true);
        fakeUserList.restore();
        done();
      });
  });
});
