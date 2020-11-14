const express = require('express');
const ip = require('ip');

const app = express();
const logging = require('./startup/logging');

logging();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
logging.logger.info(`Current Environment: ${process.env.NODE_ENV}`);

const server = app.listen(port, () => logging.logger.info(
  `Nicholas CJ Grapqhl App is listening on port ${port}! & ip: ${ip.address()}`,
));
