import { setAppRoot, getAppRoot } from '../../server/utils/helpers';

describe('getAppRoot & setAppRoot', () => {
  it('should return the global appRoot and return is as a string', () => {
    expect(getAppRoot()).to.equal(global.appRoot);
  });
  it('should return the default appRoot if none was set', () => {
    setAppRoot(undefined);
    expect(getAppRoot()).to.equal(undefined);
  });
});
