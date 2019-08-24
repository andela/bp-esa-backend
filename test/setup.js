import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

global.expect = expect;
