// const express = require('express');
// const morgan = require('morgan');

// const config = require('./config');
// // const apiRouter = require('./routes');

// const app = express();

// app.use(morgan('dev'));

// // app.use('/', express.static('./src/static'));

// app.use('/api', apiRouter);

// const server = app.listen(config.port, () => {
//   console.log(`Listening on port ${config.port}`);
// });

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// const config = require('./config');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;