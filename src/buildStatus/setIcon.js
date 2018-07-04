const setGreenIcon = (applicationName) => {
  document.getElementById(`yellow-state-${applicationName}`).style.display = 'none';
  document.getElementById(`red-state-${applicationName}`).style.display = 'none';
  document.getElementById(`green-state-${applicationName}`).style.display = 'block';
};

const setRedIcon = (applicationName) => {
  document.getElementById(`yellow-state-${applicationName}`).style.display = 'none';
  document.getElementById(`green-state-${applicationName}`).style.display = 'none';
  document.getElementById(`red-state-${applicationName}`).style.display = 'block';
};

const setYellowIcon = (applicationName) => {
  document.getElementById(`red-state-${applicationName}`).style.display = 'none';
  document.getElementById(`green-state-${applicationName}`).style.display = 'none';
  document.getElementById(`yellow-state-${applicationName}`).style.display = 'block';
};

module.exports = (build) => {
  switch (build.state) {
    case 'passed':
      setGreenIcon(build.pipeline.name);
    break;
    case 'cancelling':
    case 'canceled':
    case 'failed':
      setRedIcon(build.pipeline.name);
    break;
    case 'scheduled':
    case 'running':
      setYellowIcon(build.pipeline.name);
     break;
    default:
      break;
  }
}


