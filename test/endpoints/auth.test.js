import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../../server';


chai.use(chaiHttp);

describe('Tests for auth endpoints\n', () => {
  it('Should return all data with a 200 response code', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth')
      .type('json')
      .send({
        _method: 'post',
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6Ii1MVFdZaXFjblljWGN5LVctN0hGIiwiZmlyc3RfbmFtZSI6IkdpZGVvbiIsImxhc3RfbmFtZSI6IkFkdWt1IiwiZmlyc3ROYW1lIjoiR2lkZW9uIiwibGFzdE5hbWUiOiJBZHVrdSIsImVtYWlsIjoiZ2lkZW9uLmFkdWt1QGFuZGVsYS5jb20iLCJuYW1lIjoiR2lkZW9uIEFkdWt1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tSFVwNHViSmo0NUUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNIaTNyZThBYXZYSlNUTVFidl9tUzQ2SHUtLThyM1FNQS9zNTAtbW8vcGhvdG8uanBnIiwicm9sZXMiOnsiU2VuaW9yIFRlY2huaWNhbCBDb25zdWx0YW50IjoiLUtidVFlSTItS1VnUVB4UURKOHQiLCJBbmRlbGFuIjoiLUtpaWhmWm9zZVFlcUM2YldUYXUifX0sImlhdCI6MTU1Mjk5NTY3OCwiZXhwIjoxNTU1NTg3Njc4LCJhdWQiOiJhbmRlbGEuY29tIiwiaXNzIjoiYWNjb3VudHMuYW5kZWxhLmNvbSJ9.n3lYxYZkpiePdSjiCRpAQAlGG7j_yCGh6HB19pMpMm8FBf1JXsG8f0E-jBbgMEhEcdvGafxrjaFy58vAODI3W-CjObD1G403EhXxbAp31ZLd3U3yDrPpIt4E4nA5AU3RynX0MuBlqE_y17wNCMTkSbjzThDm0kcGrwonyTHydDU',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('confirmation')
          .to.equal('success');
        expect(res.body)
          .to.have.property('decode')
          .to.be.an('object');
        done();
      });
  });
});
