const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
};

const defaultNamespace = actionType => `entities.${actionType}`;

const makeIdsKey = entityType => `${entityType}Ids`;
const makeIdKey = entityType => `${entityType}Id`;

module.exports = {
  createReducer,
  defaultNamespace,
  makeIdsKey,
  makeIdKey
};