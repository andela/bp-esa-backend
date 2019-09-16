import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../../server';
import models from '../../server/models';
import { existingPlacement } from '../mocks/retryautomations';
import { generateToken } from '../../server/helpers/authHelpers';
import { userPayload } from '../mockData/userPayload';


chai.use(chaiHttp);

const userToken = generateToken(userPayload);

describe('Tests for engagement trends endpoint\n', () => {
  beforeEach('create mock db', async () => {
    await models.Automation.bulkCreate(existingPlacement);
  });

  afterEach(async () => {
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
  });

  it('should return stats of engagement trends', (done) => {
    chai
      .request(app)
      .get('/api/v1/dashboard/trends?duration=days')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return stats of engagement trends of a given date', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dashboard/trends?duration=days&date=${new Date(2019, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return stats of engagement trends of a given week', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dashboard/trends?duration=weeks&date=${new Date(2019, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return stats of engagement trends of a given month', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dashboard/trends?duration=months&date=${new Date(2019, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return stats of engagement trends of a given year', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dashboard/trends?duration=years&date=${new Date(2019, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return an error when an invalid duration is input', (done) => {
    chai
      .request(app)
      .get(`/api/v1/dashboard/trends?duration=invalid&date=${new Date(2019, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('invalid duration input');
        done();
      });
  });
});
