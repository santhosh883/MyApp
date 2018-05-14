import Immutable from 'immutable';
import { store } from '../utils/functional.js';
import AsyncStore from './AsyncStore.js';
import ListingActions from '../actions/ListingActions.jsx';
import ModelSource from '../source/ModelSource.js';
import PersistenceActions from '../actions/PersistenceActions.jsx';

class ListingStore extends AsyncStore {
  constructor() {
    super();
    this.models = Immutable.List();
    this.deleteModel = undefined;
    this.isLoading = false;
    this.bindListeners({
      handleDeleteModel: PersistenceActions.DELETE_MODEL,
      handleDeletingModelFailed: PersistenceActions.DELETING_MODEL_FAILED,
      handleDeletingModelSuccessful: PersistenceActions.DELETING_MODEL_SUCCESSFUL,
      handleFetchingModelsFailed: ListingActions.FETCHING_MODELS_FAILED,
      handleFetchingModelsSuccessful: ListingActions.FETCHING_MODELS_SUCCESSFUL,
      handleGetAllModels: ListingActions.GET_ALL_MODELS,
    });
    this.registerAsync(ModelSource);
  }
  /** Get models*/
  handleGetAllModels() {
    this.isLoading = true;
    this.getInstance().fetchModels();
  }

  handleFetchingModelsSuccessful(response) {
    const self = this;
    if (response.ok) {
      if (response.status !== 200) {
        this.handleFetchingModelsFailed(response.responseText || response.statusText || response.status);
        return;
      }
      this.models = response.data;
      this.isLoading = false;
      //response.json().then((modelsJson) => self.processModelsData(modelsJson, self));
    } else {
      this.handleFetchingModelsFailed(response.responseText || response.statusText || response.status);
    }
  }

  handleFetchingModelsFailed(error) {
    this.isLoading = false;
    this.handleAsyncError({
      log: `Model Fetch Failed : ${error}`,
      clientNotification: 'Model Fetch Failed. Please contact support if this continues.',
    });
  }

  /** End Get models*/

  /** Delete Model */
  handleDeleteModel(model) {
    this.deleteModel = model;
    this.isLoading = true;
    this.getInstance().deleteModel(model);
  }

  handleDeletingModelSuccessful(response) {
    if (response.ok) {
      if (response.status !== 200) {
        this.handleDeletingModelFailed(response.responseText || response.statusText || response.status);
        return;
      }
      this.isLoading = false;
      this.data[this.currentTab] = this.data[this.currentTab].filter((m) => m.id !== this.deleteModel.id);
    } else {
      this.handleDeletingModelFailed(response.responseText || response.statusText || response.status);
    }
  }

  handleDeletingModelFailed(error) {
    this.isLoading = false;
    this.handleAsyncError({
      log: `Model Delete Failed : ${error}`,
      clientNotification: 'Model Delete Failed. Please contact support if this continues.',
    });
  }
  /** End Delete Model */
}

export default store(ListingStore, 'ListingStore');
