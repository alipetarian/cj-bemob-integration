const bodyParser = require('body-parser');

// app.use(proxy(['/api' ], { target: 'https://ms-fitness-backend.herokuapp.com/' }));

// app.use('/api', createProxyMiddleware({ target: 'https://ms-fitness-backend.herokuapp.com', changeOrigin: true }));

app.get('/users', async (req, res) => {
  try {
    const GET_USERS = `
      query{
        users {
          last_name
        }
      }`;

    const reqData = {
      query: GET_USERS,
    };

    const body = JSON.stringify(reqData);
    const url = 'https://ms-fitness-backend.herokuapp.com/v1/graphql';

    const result = await axios.post(url, body, {
      headers: { ...req.header, 'Access-Control-Allow-Origin': '*', 'x-hasura-admin-secret': 'N0thing123' },
      mode: 'cors',
    });

    console.log('RESULT', result.data);

    return res.json({ data: result.data });
  } catch (err) {
    console.log('eeeeerrr+n    +++++++_', err && err.response);
    console.log('eeeeerrr+n    +++++++_', err && err.message);

    res.status(400).json({
      message: err.message,
    });
  }
});
