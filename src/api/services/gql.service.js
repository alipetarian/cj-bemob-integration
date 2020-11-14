const axios = require('axios');
const config = require('config');
const { logger } = require('../../startup/logging');

const CJ_AUTH_TOKEN = config.get("cjAuthToken")

const gqlAxios = axios.create({
  baseURL: config.get('cjGraphqlApiEndpoint'),
  headers: {
    "Authorization": `Bearer ${CJ_AUTH_TOKEN}`
  }
})

gqlAxios.interceptors.response.use(null, (error) => {
  const expectedError = error.response
    && error.response.status >= 400
    && error.response.status < 500;

  if (!expectedError) {
    logger.error("Something went wrong: GQL Services "+ error);
    const errorMessage = error.response || error.message;
    logger.error("Something went wrong: GQL Service"+ errorMessage);
  }

  return Promise.reject(error);
});

module.exports = {
  get: gqlAxios.get,
  post: gqlAxios.post,
  put: gqlAxios.put,
  delete: gqlAxios.delete,
};
