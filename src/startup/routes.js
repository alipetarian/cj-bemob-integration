const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('../api/middleware/error.middleware');
const generalRoutes = require('../api/routes/general');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded());

  /* Logging every request  */
  app.use((req, res, next) => {
    console.log('New Request: ', req.method, req.url);
    next();
  });

  /* For Cors Issue */
  const allowedOrigins = [
    '*',
  ];

  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not '
            + 'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    }),
  );

  app.get('/', (req, res) => res.send('Hello World! Nicholas CJ Grapqhl '));
  app.get('/api', (req, res) => res.send('Hello API World!'));

  app.use('/', generalRoutes);
  app.use(errorHandler.errorMiddleware);
};
