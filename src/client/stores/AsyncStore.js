import ClientNotificationActions from '../actions/ClientNotificationActions.js';

class AsyncStore {
  constructor() {}

  handleAsyncError({ log, logStyle, clientNotification } = {}) {
    if (log) {
      if (logStyle) {
        console.log(log, logStyle);
      } else {
        console.log(`%c${log}`, 'color: crimson; font-weight: bold');
      }
    }
    if (clientNotification) {
      ClientNotificationActions.notify.defer({ clientNotification });
    }
    if (this.hasOwnProperty('isLoading')) {
      this.setState({ isLoading: false });
    }
  }

  handleErrorResponse(response, fallbackMessage, error) {
    const message = (response && (response.headers.get('DD-Message') || response.responseText)) || fallbackMessage;
    if (message) {
      this.handleAsyncError({ clientNotification: message, log: error ? error.toString() : null });
    } else {
      this.handleAsyncError({
        clientNotification: 'Unknown error. Please contact customer support if it persists.',
        log: error ? error.toString() : null,
      });
    }
  }
}

export default AsyncStore;
