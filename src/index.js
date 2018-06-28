const electron = require('electron');
const {ipcRenderer} = electron;
const setIcon = require('./buildStatus/setIcon')
const THIRTY_SECONDS = 30000;
const getBuildStatus = require('./services/getBuildStatus');

//Button Token
const tokenBtn = document.getElementById('tokenBtn');
const nissUiUrl = 'https://api.buildkite.com/v2/organizations/nib-health-funds-ltd/pipelines/niss-ui/builds?branch=master';
const nissAdminUrl = 'https://api.buildkite.com/v2/organizations/nib-health-funds-ltd/pipelines/niss-admin/builds?branch=master';
const nissNailgunUrl = 'https://api.buildkite.com/v2/organizations/nib-health-funds-ltd/pipelines/niss-nailgun-api/builds?branch=master';
const nissProviderUrl = 'https://api.buildkite.com/v2/organizations/nib-health-funds-ltd/pipelines/nise-provider/builds?branch=master';

const getNissUiBuild = getBuildStatus(nissUiUrl);
const getNissAdminBuild = getBuildStatus(nissAdminUrl);
const getNissNailgunBuild = getBuildStatus(nissNailgunUrl);
const getNissProviderBuild = getBuildStatus(nissProviderUrl);


let token = '';

tokenBtn.addEventListener('click', (e) => {
  token = document.getElementById('tokenInput').value;
  getBuild();
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

const notifyIfStateChanged = (newStatus, oldState) => {
  const notification = {
    title: 'BK Alert',
    body: `BK build changed to ${newStatus}`
  }

  if(oldState.state && oldState.state !== newStatus.state) {
    new window.Notification(notification.title, notification);
  }
}


Promise.all([getNissUiBuild, getNissAdminBuild])
  .then(function(values) {
    console.log(values);
});

const getBuild = () => {
  return Promise.all([getNissUiBuild(token), getNissAdminBuild(token), getNissNailgunBuild(token), getNissProviderBuild(token)])
    .then((data) => {
      // notifyIfStateChanged(data[0], buildState)
      return data;
    })
    .then((data) => {
      // setState(data);
      data.map(setIcon);
      ipcRenderer.send('fetched-build-status');
      return data;
    })
}

// getBuild();
setInterval(getBuild, THIRTY_SECONDS);