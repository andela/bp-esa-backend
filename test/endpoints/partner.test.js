import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../../server';
import db from '../../server/models';

chai.use(chaiHttp);

describe('Tests for PUT /partners/:id endpoint', () => {
  describe('Tests for request param.id in /partners/:id endpoint', () => {
    it('Should return error when id does not start with -', (done) => {
      chai
        .request(app)
        .put('/partners/invalid-id')
        .type('json')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Partner ID is invalid');
          done();
        });
    });
    it('Should return error when length is not equal to 20', (done) => {
      chai
        .request(app)
        .put('/partners/123456789123456789     ')
        .type('json')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Partner ID is invalid');
          done();
        });
    });
  });
  describe('Tests for request body in /partners/:id endpoint', () => {
    it('should return error when missing slackChannels object', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          invalidProperty: {},
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal('slackChannels object is required');
          done();
        });
    });
    it('should return error when slackChannels is not an object', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          slackChannels: [],
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal(
            'this must be a `object` type, but the final value was: `[]`.',
          );
          done();
        });
    });
    it('should return error when general or internal property is missing', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          slackChannels: {},
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal('general channel object is required');
          expect(res.body.errors[1]).to.equal('internal channel object is required');
          done();
        });
    });
    it('should return error when general or internal property is not object', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          slackChannels: {
            general: '',
            internal: 12,
          },
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal(
            'general must be a `object` type, but the final value was: `""`.',
          );
          expect(res.body.errors[1]).to.equal(
            'internal must be a `object` type, but the final value was: `12`.',
          );
          done();
        });
    });
    it('should return error when channelId or channelName is undefined or not a string', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          slackChannels: {
            general: {
              channelId: 4,
              channelName: 'p-accessmobile',
            },
            internal: {
              channelId: 'GJ6AKSWBC',
            },
          },
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal(
            'general.channelId must be a `string` type, but the final value was: `4`.',
          );
          expect(res.body.errors[1]).to.equal('internal.channelName is a required field');
          done();
        });
    });
    it('should return error when channelProvision is not retrieve', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj17U')
        .type('json')
        .send({
          slackChannels: {
            general: {
              channelId: 'GJ6AKSWBC',
              channelName: 'p-accessmobile',
              channelProvision: 'wisdom',
            },
            internal: {
              channelId: 'GJH7JJ6E8',
              channelName: 'p-accessmobile-int',
              channelProvision: 'love',
            },
          },
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ValidationError');
          expect(res.body)
            .to.have.property('errors')
            .which.is.an('array');
          expect(res.body.errors[0]).to.equal(
            'general.channelProvision should be retrieve',
          );
          expect(res.body.errors[1]).to.equal(
            'internal.channelProvision should be retrieve',
          );
          done();
        });
    });
    it('should return 404 error when partner does not exist', (done) => {
      chai
        .request(app)
        .put('/partners/-KXGyJcC1oimjQgFj18t')
        .type('json')
        .send({
          slackChannels: {
            general: {
              channelId: 'GJ6AKSWBC',
              channelName: 'p-accessmobile',
              channelProvision: 'retrieve',
            },
            internal: {
              channelId: 'GJH7JJ6E8',
              channelName: 'p-accessmobile-int',
              channelProvision: 'retrieve',
            },
          },
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Partner does not exist');
          done();
        });
    });
    it('should return 200 status code, when request data is valid', async () => {
      const partnerData = {
        freckleProjectId: null,
        name: 'Access.Mobile, Inc.',
        partnerId: '-KXGyJcC1oimjQgF1234',
        slackChannels: {},
        location: 'Denver CO, USA',
      };
      const channelData = {
        slackChannels: {
          general: {
            channelId: 'GJ6AKSWBC',
            channelName: 'p-accessmobile',
            channelProvision: 'retrieve',
          },
          internal: {
            channelId: 'GJH7JJ6E8',
            channelName: 'p-accessmobile-int',
            channelProvision: 'retrieve',
          },
        },
      };

      await db.Partner.destroy({ force: true, truncate: { cascade: true } });
      const newPartner = await db.Partner.create({ ...partnerData, ...channelData });
      const channelUpdate = { ...channelData };
      channelUpdate.slackChannels.general.channelName = 'p-accessbank';
      channelUpdate.slackChannels.internal.channelId = 'GJH7JABCD';
      chai
        .request(app)
        .put(`/partners/${partnerData.partnerId}`)
        .type('json')
        .send(channelUpdate)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Partner update successful');
          expect(res.body.data)
            .to.have.property('partnerId')
            .to.equal(newPartner.partnerId);
          expect(res.body.data.slackChannels.general)
            .to.have.property('channelName')
            .to.equal('p-accessbank');
          expect(res.body.data.slackChannels.internal)
            .to.have.property('channelId')
            .to.equal('GJH7JABCD');
        });
    });
  });
});
