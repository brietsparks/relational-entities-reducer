const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
};

const combineReducers = (reducers = {}) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((reducedState, stateKey) => {
      const reducer = reducers[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], action);
      return reducedState;
    }, {});
  };
};

module.exports = { createReducer, combineReducers };