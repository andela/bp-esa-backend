import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
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
      .get(`/api/v1/automations?page=1&limit=5&slackAutomation=success&emailAutomation=failure&freckleAutomation=failure&date[from]=${(new Date(2019, 1, 1)).toISOString()}&date[to]=${(new Date(2019, 2, 10)).toISOString()}`)
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
      .get(`/api/v1/automations?page=1&limit=5&slackAutomation=success&date[to]=${(new Date()).toJSON()}`)
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
      .get(`/api/v1/automations?page=1&limit=5&slackAutomation=success&date[from]=${(new Date(2019, 2, 10)).toISOString()}`)
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
      .get(`/api/v1/automations?page=1&limit=5&date[from]=${(new Date(2020, 1, 1)).toISOString()}&date[to]=${new Date(2019, 2, 10).toISOString()}`)
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
  it('Should filter automation data with type offboarding', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&type=offboarding')
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
  it('Should search automation data for partners or fellows name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?q=conroy')
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
  it('Should search automation with fellow name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?q=val&queryType=fellow')
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
  it('Should search automation with partner name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?q=conroy&queryType=partner')
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
});
