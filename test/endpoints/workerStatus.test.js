import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server';
import client from '../../server/helpers/redis';
import { generateToken } from '../../server/helpers/authHelpers';
import { userPayload } from '../mockData/userPayload';

chai.use(chaiHttp);

const userToken = generateToken(userPayload);
const fakeStatus = ['"2019-01-09T09:59:53.045Z"', 'Successfull', '2'];

describe('Tests for worker status endpoints\n', () => {
  it('Should return worker status with a 200 status code', (done) => {
    const fakeClient = sinon
      .stub(client, 'mget')
      .callsFake((startTime, message, numberOfJobs, cb) => cb.apply(this, [null, fakeStatus]));

    chai
      .request(app)
      .get('/worker-status')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfull');
        expect(res.body)
          .to.have.property('numberOfJobs')
          .to.equal('2');
        expect(res.body).to.have.property('upTime');
        expect(res.body).to.have.property('startTime');
        done();
        fakeClient.restore();
      });
  });
  it('Should return error response with 500 status code', (done) => {
    const fakeClient = sinon
      .stub(client, 'mget')
      .callsFake((startTime, message, numberOfJobs, cb) => cb.apply(this, ['error', null]));

    chai
      .request(app)
      .get('/worker-status')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Error with redis connection, kindly connect to redis');
        done();
        fakeClient.restore();
      });
  });
});
