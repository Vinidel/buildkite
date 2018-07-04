const electron = require('electron');
const {ipcRenderer, shell} = electron;
const setIcon = require('./buildStatus/setIcon')
const THIRTY_SECONDS = 30000;
const getBuildStatus = require('./services/getBuildStatus');
const composeFunctions = require('./utils/composeFunctions');
const notifyIfStateChanged = require('./notifications/notifyIfChanged');

//AlertStatus Button
let alertConfigState = 'ON';
document.getElementById('alertBtn').addEventListener('click', () => {
  const alertStatus = document.getElementById('alertStatus')
  const newBtnTextStatus = alertStatus.innerText === 'ON' ? 'OFF' : 'ON'; 
  alertConfigState = alertStatus.innerText; 
  alertStatus.innerText = newBtnTextStatus; 
})


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


//Opens link in Browser
document.getElementById('buildLink-niss-ui').addEventListener('click', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});
document.getElementById('buildLink-niss-admin').addEventListener('click', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});
document.getElementById('buildLink-niss-nailgun-api').addEventListener('click', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});
document.getElementById('buildLink-nise-provider').addEventListener('click', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});

//Work in progress
const setAppDescription = (build) => {
  document.getElementById(`appDescription-${build.pipeline.name}`).innerHTML = build.pipeline.description;
}

const setBuildDetails = (build) => {
  document.getElementById(`authorName-${build.pipeline.name}`).innerHTML = build.creator.name;
  document.getElementById(`buildLink-${build.pipeline.name}`).href = build.web_url;
  // document.getElementById(`authorName-${build.pipeline.name}`).innerHTML = build.creator.name;
}

const setValuesToPage = (build) => {
  setIcon(build);
  setAppDescription(build);
  setBuildDetails(build);
}

let token = '';

tokenBtn.addEventListener('click', (e) => {
  token = document.getElementById('tokenInput').value;
  getBuild();
})


const oldBuildState = {
  builds: []
}

const setOldBuildState = (newState) => {
  oldBuildState.builds = newState;
}

const checkIfNotificationNeeded = (newState) => {
  if (alertConfigState === 'ON') {
    const index = oldBuildState.builds.findIndex((e) => e.pipeline.name === newState.pipeline.name);
    if (index !== -1) {
      notifyIfStateChanged(newState, oldBuildState.builds[index])
    }
  }
}

const getBuild = () => {
  document.getElementById('errorContainer').style.display = 'none';
  return Promise.all([getNissUiBuild(token), getNissAdminBuild(token), getNissNailgunBuild(token), getNissProviderBuild(token)])
    .then((data) => {
      data.map((build) => composeFunctions(setValuesToPage(build), checkIfNotificationNeeded(build)));
      ipcRenderer.send('fetched-build-status');
      return data;
    })
    .then(data => { 
      setOldBuildState(data)
    })
    .catch(e => {
      setErrorToPage(e.message);
    })
}

const setErrorToPage = (errorMessage) => {
  document.getElementById('errorContainer').style.display = 'block'
  document.getElementById('errorText').innerHTML = errorMessage || '';
}

// const test = (arg) => console.log(oldBuildState)

// getBuild();
setInterval(getBuild, THIRTY_SECONDS);