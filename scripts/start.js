const tsNodeDev = require('ts-node-dev');
const paths = require('../config/paths');
const { logMessage } = require('./utils');

// Todo Change the logger to use morgan
((async () => {
  try {
    const script = paths.srcServer;
    tsNodeDev(script, [], [], []);
  } catch (error) {
    logMessage(error, 'error');
    process.exit(1);
  }
})());
