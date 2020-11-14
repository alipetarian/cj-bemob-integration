const http = require('./httpService');

const SIGNUP_HASURA_OPERATION = `
  mutation ($email: String!, $first_name: String!, $last_name: String!, $password: String!, $user_name: String!) {
    insert_users_one(object: { email: $email, first_name: $first_name, last_name: $last_name, password: $password, user_name: $user_name }) {
      id
    }
  }
`;

const GET_USER_WITH_EMAIL_OPERATION = `
  query($email: String!) {
    users(where: {email: {_eq: $email}}) {
      email
      first_name
      last_name
      id
      password
    }
  }
`;

module.exports.signupUser = (variables) => {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;

  const reqData = {
    query: SIGNUP_HASURA_OPERATION,
    variables,
  };

  const body = JSON.stringify(reqData);
  return http.post('/', body);
};

module.exports.getUserWithEmail = (variables) => {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;

  const reqData = {
    query: GET_USER_WITH_EMAIL_OPERATION,
    variables,
  };

  const body = JSON.stringify(reqData);
  return http.post('/', body);
};
