const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const paths = {
  dotenv: resolveApp('.env'),
  src: resolveApp('server'),
  srcServer: resolveApp('server/bin/Server'),
};

paths.resolveModules = [
  paths.srcServer,
  paths.src,
  'node_modules',
];

module.exports = paths;
