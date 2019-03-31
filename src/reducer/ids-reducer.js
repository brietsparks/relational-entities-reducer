const { createReducer, makeIdsKey } = require('../util');

const createIdsOfTypeReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityId, index }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return index
        ? [...state].splice(index, 0, entityId)
        : [...state, entityId];
    }
  });
};

const createIdsReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    const idsKey = makeIdsKey(entityType);
    reducers[idsKey] = createIdsOfTypeReducer(schema, actions);
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