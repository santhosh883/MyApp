import { store } from '../utils/functional.js';
import ClientNotificationActions from '../actions/ClientNotificationActions.js';

class ClientNotificationStore {
  constructor() {
    this.clientNotification = null;
    this.open = false;
    this.bindListeners({
      handleNotification: ClientNotificationActions.NOTIFY,
      handleNotificationDismissed: ClientNotificationActions.NOTIFICATION_DISMISSED,
    });
  }

  handleNotification({ clientNotification }) {
    if (!!clientNotification) {
      this.open = true;
      this.clientNotification = clientNotification;
    }
  }

  handleNotificationDismissed() {
    this.open = false;
    this.clientNotification = null;
  }
}

export default store(ClientNotificationStore, 'ClientNotificationStore');
