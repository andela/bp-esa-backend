import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import faker from 'faker';
import app from '../../server';


chai.use(chaiHttp);

describe('Tests for automation endpoints\n', () => {
  it('Should return all data with a 200 response code', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        done();
      });
  });
  it('Should filter automation data', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&slackAutomation=success&emailAutomation=failure&freckleAutomation=failure&date[from]=Fri Feb 01 2019 00:00:00 GMT+0300 (East Africa Time)&date[to]=Sun Mar 10 2019 00:00:00 GMT+0300 (East Africa Time)')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data with date[from] missing', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&slackAutomation=success&date[to]=Sun Mar 10 2019 00:00:00 GMT+0300 (East Africa Time)')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should filter automation data with date[to] missing', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&slackAutomation=success&date[from]=Sun Mar 10 2019 00:00:00 GMT+0300 (East Africa Time)')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body.pagination)
          .to.have.property('currentPage')
          .to.be.equal(1);
        done();
      });
  });
  it('Should return error if date[from] > date[to] ', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&date[from]=Fri Feb 01 2020 00:00:00 GMT+0300 (East Africa Time)&date[to]=Sun Mar 10 2019 00:00:00 GMT+0300 (East Africa Time)')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('date[from] cannot be greater than date[now] or today');
        done();
      });
  });
});
