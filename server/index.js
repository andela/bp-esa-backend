import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import models from "./models";


// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

models.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${app.get('port')}`);
    });
  }
)
  
export default app;
