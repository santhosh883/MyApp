import 'whatwg-fetch';
import ListingActions from '../actions/ListingActions.jsx';
import PersistenceActions from '../actions/PersistenceActions.jsx';
import { get, del, post, put } from '../utils/fetch.js';

const token = '1234'; //TODO: generate token
const restUrl = 'http://localhost:8081/myApp/listing'; //TODO: Create Endpoint
const ModelSource = {
  fetchModels: {
    remote: (state, model) => get(token, restUrl),
    success: ListingActions.fetchingModelsSuccessful,
    error: ListingActions.fetchingModelsFailed,
  },
  deleteModel: {
    remote: (state, model) => del(token, `${restUrl}/${model.id}`),
    success: PersistenceActions.deletingModelSuccessful,
    error: PersistenceActions.deletingModelFailed,
  },
  createModel: {
    remote: (state, model) => post(token, restUrl, model),
    success: PersistenceActions.creatingModelSuccessful,
    error: PersistenceActions.creatingModelFailed,
  },
  updateModel: {
    remote: (state, model) => put(token, restUrl, model),
    success: PersistenceActions.updatingModelSuccessful,
    error: PersistenceActions.updatingModelFailed,
  },
};

export default ModelSource;
