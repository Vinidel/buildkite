module.exports = (newState, oldState) => {
  const notification = {
    title: 'BK Alert',
    body: `${newState.pipeline.name} status is ${newState.state}`
  }

  if(oldState.state && oldState.state !== newState.state) {
    new window.Notification(notification.title, notification);
  }
}
