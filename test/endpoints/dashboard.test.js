import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../../server';
import models from '../../server/models';
import { existingPlacement } from '../mocks/retryautomations';


chai.use(chaiHttp);

describe('Tests for upselling partners endpoints\n', () => {
  beforeEach('create mock db', async () => {
    await models.Automation.bulkCreate(existingPlacement);
  });

  afterEach(async () => {
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
  });
  it('Should return paginated data with default limit of 10, with a 200 response code', (done) => {
    chai
      .request(app)
      .get('/api/v1/dashboard/upselling-partners')
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
  it('Should return paginated data with a 200 response code', (done) => {
    chai
      .request(app)
      .get('/api/v1/dashboard/upselling-partners?page=1&limit=1')
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
  it('Should filter upselling partner data with date[startDate] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/upselling-partners?page=1&limit=5&date[endDate]=${new Date().toJSON()}`,
      )
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
  it('Should filter automation data with date[endDate] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/upselling-partners?page=1&limit=5&date[startDate]=${new Date(
          2019,
          2,
          10,
        ).toISOString()}`,
      )
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
  it('Should return error if date[startDate] > date[endDate] ', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/upselling-partners?page=1&limit=5&date[startDate]=${new Date(
          2020,
          1,
          1,
        ).toISOString()}&date[endDate]=${new Date(2019, 2, 10).toISOString()}`,
      )
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('startDate cannot be greater than endDate');
        done();
      });
  });
});

describe('Tests for partner stats endpoints\n', () => {
  beforeEach('create mock db', async () => {
    await models.Automation.bulkCreate(existingPlacement);
  });

  afterEach(async () => {
    await models.Automation.destroy({ force: true, truncate: { cascade: true } });
  });
  it('Should filter partner stats data with date[startDate] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/partner-stats?date[endDate]=${new Date().toJSON()}`,
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.data)
          .to.be.an.instanceof(Array)
          .and.to.have.property(0)
          .that.includes.all.keys(['count', 'type']);
        done();
      });
  });
  it('Should filter partner stats data with date[endDate] missing', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/partner-stats?date[startDate]=${new Date(
          2019,
          2,
          10,
        ).toISOString()}`,
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched data');
        expect(res.body.data)
          .to.be.an.instanceof(Array);
        done();
      });
  });
  it('Should return error if date[startDate] > date[endDate] ', (done) => {
    chai
      .request(app)
      .get(
        `/api/v1/dashboard/partner-stats?date[startDate]=${new Date(
          2020,
          1,
          1,
        ).toISOString()}&date[endDate]=${new Date(2019, 2, 10).toISOString()}`,
      )
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('startDate cannot be greater than endDate');
        done();
      });
  });
});
