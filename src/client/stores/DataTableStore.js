import Immutable from 'immutable';
import { store } from '../utils/functional.js';
import DataTableActions from '../actions/DataTableActions.js';

class DataTableStore {
  constructor() {
    this.deletables = Immutable.Map();
    this.isDeleting = (deletable) => this.deletables.getIn(this._path(deletable));
    this.bindListeners({
      handleShowHideDeleteConfirmation: DataTableActions.SHOW_HIDE_DELETE_CONFIRMATION,
    });
  }

  handleShowHideDeleteConfirmation({ deletable, flag }) {
    if (flag) {
      this.deletables = this.deletables.setIn(this._path(deletable), true);
    } else {
      this.deletables = this.deletables.deleteIn(this._path(deletable));
    }
  }

  _path(deletable) {
    return [deletable.constructor.name, deletable.id];
  }
}
export default store(DataTableStore, 'DataTableStore');
