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
});
