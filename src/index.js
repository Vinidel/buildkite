const electron = require('electron');
const path = require('path');
const axios = require('axios');
const {ipcRenderer} = electron;

const THIRTY_SECONDS = 30000;

//Button Token
const tokenBtn = document.getElementById('tokenBtn');
let tokenValue = '';

///Get build options
//Bearer 3f7f9b6a6cfdb929b35e196a044ea1d339c1aafd
const url = 'https://api.buildkite.com/v2/organizations/nib-health-funds-ltd/pipelines/niss-ui/builds?branch=master';
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer 3f7f9b6a6cfdb929b35e196a044ea1d339c1aafd'
  },
  url
};

tokenBtn.addEventListener('click', (e) => {
  tokenValue = document.getElementById('tokenInput').value;
  options.headers.Authorization = `Bearer ${tokenValue}`;
  getBuildStatus();
  // ipcRenderer.send('token-input', document.getElementById('tokenInput').value);
})


const buildState = {
  state: '',
  number: '',
  message: '',
  applicationName: 'niss-ui'
}

const setState = (newState) => {
  buildState.state = newState.state;
  buildState.number = newState.number;
  buildState.message = newState.message;
}



const setGreenIcon = () => {
  document.getElementById('yellow-state').style.display = 'none';
  document.getElementById('red-state').style.display = 'none';
  document.getElementById('green-state').style.display = 'block';
};

const setRedIcon = () => {
  document.getElementById('yellow-state').style.display = 'none';
  document.getElementById('green-state').style.display = 'none';
  document.getElementById('red-state').style.display = 'block';
};

const setYellowIcon = () => {
  document.getElementById('red-state').style.display = 'none';
  document.getElementById('green-state').style.display = 'none';
  document.getElementById('yellow-state').style.display = 'block';
};

const setBuildIcon = (status) => {
  switch (status) {
    case 'passed':
      setGreenIcon();
    break;
    case 'failed':
      setRedIcon();
    break;
    case 'running':
      setYellowIcon();
     break;
    default:
      break;
  }
}

const notifyIfStateChanged = (newStatus, oldState) => {
  const notification = {
    title: 'BK Alert',
    body: `BK build changed to ${newStatus}`
  }

  if(oldState.state && oldState.state !== newStatus.state) {
    new window.Notification(notification.title, notification);
  }
}

const getBuildStatus = () => {
  console.log(options)
  axios(options)
    .then(res => (res.data[0]))
    .then((data) => {
      notifyIfStateChanged(data, buildState)
      return data;
    })
    .then((data) => {
      setState(data);
      setBuildIcon(data.state);
      ipcRenderer.send('fetched-build-status');
      return data;
    })
}
getBuildStatus();
setInterval(getBuildStatus, THIRTY_SECONDS);