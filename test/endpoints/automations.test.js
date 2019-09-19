import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../../server';
import models from '../../server/models';
import {
  retryMockData, existingPlacement, slackAutomations, nokoAutomations, emailAutomations,
  offboardingMockData, partnerData,
} from '../mocks/retryautomations';
import { generateToken } from '../../server/helpers/authHelpers';
import { userPayload } from '../mockData/userPayload';


chai.use(chaiHttp);

const userToken = generateToken(userPayload);

describe('Tests for automation endpoints\n', () => {
  beforeEach('create mock db', async () => {
    await models.Automation.bulkCreate(existingPlacement);
  });

  afterEach(async () => {
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
  });

  it('should return a 401 error if user does not supply token', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .set('authorization', '')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .to.equal('No token provided');
        done();
      });
  });
  it('should return a 401 error if user supplies an invalid token', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .set('authorization', 'invalidToken')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .to.equal('Token is not valid');
        done();
      });
  });
  it('Should return all data with a 200 response code', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        done();
      });
  });
  it('Should return paginated automation data with a 200 response code', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        done();
      });
  });
  it('Should show previous page number if page > 1', (done) => {
    chai
      .request(app)
      .get(
        '/api/v1/automations?page=2&limit=5',
      )
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination.prevPage)
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/automations?page=1&limit=5&slackAutomation=success&emailAutomation=failure&nokoAutomation=failure&date[from]=${new Date(
          2019,
          1,
          1,
        ).toISOString()}&date[to]=${new Date(2019, 2, 10).toISOString()}`,
      )
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data with date[from] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/automations?page=1&limit=5&slackAutomation=success&date[to]=${new Date().toJSON()}`,
      )
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data with date[to] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/automations?page=1&limit=5&slackAutomation=success&date[from]=${new Date(
          2019,
          2,
          10,
        ).toISOString()}`,
      )
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should return error if date[from] > date[to] ', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/automations?page=1&limit=5&date[from]=${new Date(
          2020,
          1,
          1,
        ).toISOString()}&date[to]=${new Date(2019, 2, 10).toISOString()}`,
      )
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('date[from] cannot be greater than date[now] or today');
        done();
      });
  });
  it('Should filter automation data with type onboarding', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&type=onboarding')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data with type offboarding', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&type=offboarding')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should search automation data for partners or fellows name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?searchTerm=conroy')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should search automation with fellow name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?searchTerm=val&searchBy=fellow')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should search automation with partner name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?searchTerm=conroy&searchBy=partner')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('should return stats of total automations', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/stats?duration=days')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.be.a('Number');
        done();
      });
  });
  it('should return stats of total automations of a given date', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?duration=days&date=${new Date(2018, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.be.a('Number');
        done();
      });
  });
  it('should return stats of total automations of a given week', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?duration=weeks&date=${new Date(2018, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.equal(0);
        done();
      });
  });
  it('should return stats of total automations of a given month', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?duration=months&date=${new Date(2018, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.equal(0);
        done();
      });
  });
  it('should return stats of total automations of a given year', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?duration=years&date=${new Date(2018, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.equal(0);
        done();
      });
  });
  it('should return an error when an invalid duration is input', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?duration=invalid&date=${new Date(2018, 4, 1).toISOString()}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('invalid duration input');
        done();
      });
  });
  it('should return stats of onboarding successfull automations', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/stats?duration=days')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('onboarding')
          .to.have.property('success')
          .to.be.equal(0);
        done();
      });
  });
  it('should return all the automations', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/?limit=-1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe(' Test for retrying automations', () => {
  beforeEach('create mock db', async () => {
    await models.NokoAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.SlackAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.EmailAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.Partner.destroy({ force: true, truncate: { cascade: true } });
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });

    await models.Automation.bulkCreate(existingPlacement);
    await models.Partner.create(partnerData);
    await models.EmailAutomation.bulkCreate(emailAutomations);
    await models.SlackAutomation.bulkCreate(slackAutomations);
    await models.NokoAutomation.bulkCreate(nokoAutomations);
  });

  afterEach(async () => {
    await models.NokoAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.SlackAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.EmailAutomation.destroy({ force: true, truncate: { cascade: true } });
    await models.Partner.destroy({ force: true, truncate: { cascade: true } });
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
  });
  it('should return the onboarding updated automation results', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/${retryMockData.id}`)
      .set('authorization', userToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched individual automation');
        done();
      });
  });
  it('should return the offboarding updated automation results', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/${offboardingMockData.id}`)
      .set('authorization', userToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched individual automation');
        done();
      });
  });
});

describe('Tests for creating a report', () => {
  it('should create a report', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/downloadReport')
      .set('authorization', userToken)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should fetch a created report', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/fetchReport')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
