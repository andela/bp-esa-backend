import { setJwtKey } from '../../server/middleware/auth';
import env from '../../server/validator';

describe('setJwtKey', () => {
  it('should set the right key during test environment', () => {
    const decodingKey = setJwtKey('test');
    expect(decodingKey).to.equal(env.JWT_KEY);
  });

  it('should set the right key during devlopment / production environment', () => {
    const decodingKey = setJwtKey('development');
    expect(Buffer.isBuffer(decodingKey)).to.equal(true);
  });
});
