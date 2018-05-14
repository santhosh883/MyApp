import Alt from '../utils/alt.js';

const thing = typeof window !== 'undefined' ? window : global;

export const merge = (...objs) => {
  const plainObjects = objs.map((o) => (!o || !o.toJS ? o : o.toJS()));
  return Object.assign({}, ...plainObjects);
};
thing.merge = merge;

export const store = (cls, name, constructorArgs) => Alt.createStore(cls, name, constructorArgs);
thing.store = store;

export const nameAsPath = (name) => {
  if (!name) {
    name = 'unknown';
  }
  const path = (name || '').toLowerCase().replace(/[\W]+/g, '-');
  if (path[path.length - 1] === '-') {
    return path.substring(0, path.length - 1);
  } else {
    return path;
  }
};

export const modelLink = (model) =>
  model && model.id ? `${window.customScoringBaseURL}/model/${model.id}` : `${window.customScoringBaseURL}/model/new`;
