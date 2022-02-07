const axios = require('axios');

const config = require('config');
const { logger } = require('../../startup/logging');

axios.defaults.baseURL = config.get('voluumTrackingDomain');

axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response
    && error.response.status >= 400
    && error.response.status < 500;

  if (!expectedError) {
    logger.error(`Something went wrong in http Service: `+ error);
    const errorMessage = error.response || error.message;
    logger.error('Something went wrong in http Service: '+ errorMessage);
  }

  return Promise.reject(error);
});

module.exports = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
