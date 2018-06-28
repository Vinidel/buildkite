const axios = require('axios');
// const {ipcRenderer} = electron;

module.exports = (url) => (token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
      // Authorization: `Bearer 3f7f9b6a6cfdb929b35e196a044ea1d339c1aafd`
    },
    url
  };

  return axios(options).then(res => (res.data[0]));
}

//token 3f7f9b6a6cfdb929b35e196a044ea1d339c1aafd
// ipcRenderer.on('token-set', (event, arg) => {
//   options.headers.Authorization = `Bearer ${arg}`
//   ipcRenderer.send('look-at-this', arg);
// })
