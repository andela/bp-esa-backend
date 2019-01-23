import response from '../../server/helpers/response';

describe('Test that valid response object is returned', () => {
  it('Ensure that response object contains data field', () => {
    const data = { password: 'should be more than 6 chars' };
    const responseObject = response(true, 'something bad happened', data);
    expect(responseObject.data).to.equal(data);
  });
});
