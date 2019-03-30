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

const makeManyFk = entityType => `${entityType}Keys`;
const makeOneFk = entityType => `${entityType}Key`;

module.exports = {
  createReducer,
  defaultNamespace,
  makeManyFk,
  makeOneFk
};