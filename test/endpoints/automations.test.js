import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import moment from 'moment';
import app from '../../server';
import models from '../../server/models';
import createAutomationFakeData, { createSlackAutomation, createFreckleAutomation, createEmailAutomation } from '../mocks/getAutomations';


chai.use(chaiHttp);

describe('Tests for automation endpoints\n', () => {
  let getAutomation;
  let automationsSortedByDate;
  beforeEach(async () => {
    getAutomation = await models.Automation.bulkCreate(createAutomationFakeData());
    await models.SlackAutomation.bulkCreate(createSlackAutomation(getAutomation));
    await models.FreckleAutomation.bulkCreate(createFreckleAutomation(getAutomation));
    await models.EmailAutomation.bulkCreate(createEmailAutomation(getAutomation));
    automationsSortedByDate = getAutomation.reduce((accum, item) => {
      const date = moment(item.createdAt).format('YYYY-MM-DD');
      if (!accum.has(date)) {
        accum.set(date, []);
      }
      const currentDate = accum.get(date);
      currentDate.push(item);
      return accum;
    }, new Map());
  });
  afterEach(async () => {
    await models.FreckleAutomation.truncate();
    await models.SlackAutomation.truncate();
    await models.EmailAutomation.truncate();
    await models.Automation.truncate({ cascade: true });
  });
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
          .to.be.an('array')
          .to.have.length(10);
        done();
      });
  });
  it('Should return paginated data in page 1', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array')
          .to.have.length(5);
        expect(res.body)
          .to.have.property('pagination')
          .to.be.an('object')
          .to.include({
            currentPage: 1, numberOfPages: 2, dataCount: '10', nextPage: 2,
          });
        done();
      });
  });
  it('Should return paginated data in page 2', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=2&limit=5')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array')
          .to.have.length(5);
        expect(res.body)
          .to.have.property('pagination')
          .to.be.an('object')
          .to.include({
            currentPage: 2, numberOfPages: 2, dataCount: '10', prevPage: 1,
          });
        done();
      });
  });
  it('Should return data from date[from] is provided', (done) => {
    const checkArrayDate = [];
    const dates = automationsSortedByDate.keys();
    // extracting the first date in the dateToAutomation map
    const currentDate = dates.next().value;
    const dateToUse = moment(currentDate, 'YYYY-MM-DD');
    // eslint-disable-next-line prefer-const
    // eslint-disable-next-line no-restricted-syntax
    for (const dataDate of automationsSortedByDate.entries()) {
      if (dataDate[0] >= currentDate) {
        // create a flat array of all automation created on or after dateToUse
        checkArrayDate.push(...dataDate[1]);
      }
    }
    chai
      .request(app)
      .get(`/api/v1/automations?page=1&limit=10&date[from]=${dateToUse.toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        expect(res.body.data.length)
          .to.equal(checkArrayDate.length);
        done();
      });
  });
  it('Should return data up to date[to] when provided', (done) => {
    const checkArrayDate = [];
    const dates = automationsSortedByDate.keys();
    // extracting the first date in the dateToAutomation map
    const currentDate = dates.next().value;
    const dateToUse = moment(currentDate, 'YYYY-MM-DD');
    // eslint-disable-next-line prefer-const
    // eslint-disable-next-line no-restricted-syntax
    for (const dataDate of automationsSortedByDate.entries()) {
      if (dataDate[0] <= currentDate) {
        // create a flat array of all automation created on or after dateToUse
        checkArrayDate.push(...dataDate[1]);
      }
    }
    chai
      .request(app)
      .get(`/api/v1/automations?page=1&limit=10&date[to]=${dateToUse.toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        expect(res.body.data.length)
          .to.equal(checkArrayDate.length);
        done();
      });
  });
  it('Should return data between date[from] and date[to]', (done) => {
    const checkArrayDate = [];
    const dates = automationsSortedByDate.keys();
    // extracting the first date in the dateToAutomation map
    const currentDate = dates.next().value;
    const dateFrom = moment(currentDate, 'YYYY-MM-DD');
    const dateTo = moment(moment(new Date('March 31 2019 12:30')).format('YYYY-MM-DD', 'YYYY-MM-DD'));
    // console.log({ dateTo });
    // eslint-disable-next-line prefer-const
    // eslint-disable-next-line no-restricted-syntax
    for (const dataDate of automationsSortedByDate.entries()) {
      if (dataDate[0] >= currentDate || dataDate[0] <= dateTo) {
        // create a flat array of all automation created on or after dateToUse
        checkArrayDate.push(...dataDate[1]);
      }
    }
    chai
      .request(app)
      .get(`/api/v1/automations?page=1&limit=10&date[from]=${dateFrom.toISOString()}&date[to]=${dateTo.toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('array');
        expect(res.body.data.length)
          .to.equal(checkArrayDate.length);
        done();
      });
  });
  it('Should return error message when date[from] is greater than date[to]', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations?page=1&limit=5&date[from]=${new Date('March 01 2019 12:30').toISOString()}&date[to]=${new Date('February 01 2019 12:30').toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('date[from] cannot be greater than date[now] or today');
        done();
      });
  });
  it('Should filter successful freckleAutomations data', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=10&freckleAutomation=success')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body)
          .to.have.property('data')
          .to.have.lengthOf.below(10);
        expect(res.body.data[0].freckleAutomations.status)
          .to.be.equal('success');
        done();
      });
  });
  it('Should filter successful slackAutomations data', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&slackAutomation=success')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body.data[0].slackAutomations.status)
          .to.be.equal('success');
        done();
      });
  });
  it('Should filter successful emailAutomations data', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations?page=1&limit=5&emailAutomation=success')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        expect(res.body.data)
          .to.have.lengthOf.below(10);
        done();
      });
  });
  it('Should filter slackAutomation, emailAutomation  slackAutomation, date[from], and date[to] to return less than 10 items', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations?page=1&limit=5&slackAutomation=success&emailAutomation=failure&freckleAutomation=failure&date[from]=${(new Date('January 31 2019 12:30')).toISOString()}&date[to]=${(new Date('March 31 2019 12:30')).toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data)
          .to.have.lengthOf.below(10);
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
        expect(res.body.data[0])
          .to.have.property('type')
          .to.be.equal('onboarding');
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
        expect(res.body.data[0])
          .to.have.property('type')
          .to.be.equal('offboarding');
        done();
      });
  });
  it('Should search automation data for partners or fellows name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        const { fellowName } = res.body.data[0];
        chai
          .request(app)
          .get(`/api/v1/automations?searchTerm=${fellowName}`)
          .end((error, response) => {
            expect(response.body.data[0].fellowName)
              .to.have.string(fellowName);
            done();
          });
      });
  });
  it('Should search automation with fellow name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        const { fellowName } = res.body.data[0];
        chai
          .request(app)
          .get(`/api/v1/automations?searchTerm=${fellowName}&searchBy=fellow`)
          .end((error, response) => {
            expect(response.body.data[0].fellowName)
              .to.have.string(fellowName);
            done();
          });
      });
  });
  it('Should search automation with partner name containing a string', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .to.equal('Successfully fetched automations');
        const { partnerName } = res.body.data[0];
        chai
          .request(app)
          .get(`/api/v1/automations?searchTerm=${partnerName}&searchBy=partner`)
          .end((error, response) => {
            expect(response.body.data[0].partnerName)
              .to.have.string(partnerName);
            done();
          });
      });
  });
  it('should return stats of total automations', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/stats')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.equal(0);
        done();
      });
  });
  it('should return stats of total automations of a given date', (done) => {
    chai
      .request(app)
      .get(`/api/v1/automations/stats?date=${new Date(2018, 4, 1).toISOString()}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('automation')
          .to.have.property('total')
          .to.be.equal(0);
        done();
      });
  });
  it('should return stats of onboarding successfull automations', (done) => {
    chai
      .request(app)
      .get('/api/v1/automations/stats')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('onboarding')
          .to.have.property('success')
          .to.be.equal(0);
        done();
      });
  });
});
