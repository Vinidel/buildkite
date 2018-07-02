module.exports = (newState, oldState) => {
  const notification = {
    title: 'BK Alert',
    body: `You have a build status change`
  }

  if(oldState.state && oldState.state !== newState.state) {
    new window.Notification(notification.title, notification);
  }
}
