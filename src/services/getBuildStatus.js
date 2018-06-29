const axios = require('axios');
// const {ipcRenderer} = electron;

module.exports = (url) => (token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    url
  };

  return axios(options).then(res => (res.data[0]));
}

// ipcRenderer.on('token-set', (event, arg) => {
//   options.headers.Authorization = `Bearer ${arg}`
//   ipcRenderer.send('look-at-this', arg);
// })
