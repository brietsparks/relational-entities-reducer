const { createReducer } = require('../util');

const createIdsOfTypeReducer = (schema, actions) => {
  const { ADD, REMOVE } = actions;

  return createReducer([], {
    [ADD]: (state, { entityType, entityId, index, entityExists }) => {
      if (entityType !== schema.type || entityExists) {
        return state;
      }

      return index
        ? [...state].splice(index, 0, entityId)
        : [...state, entityId];
    },
    [REMOVE]: (state, { entityType, entityId: removableId }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return state.filter(entityId => entityId !== removableId);
    }
  });
};

const createIdsReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    reducers[entityType] = createIdsOfTypeReducer(schema, actions);
    return reducers;
  }, {});

  return (state = {}, action) => {
    // equivalent of combineReducers
    return Object.keys(reducers).reduce((reducedState, stateKey) => {
      const reducer = reducers[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], action);
      return reducedState;
    }, {})
  };
};

module.exports = {
  createIdsReducer,
};