const { createReducer, makeKeysKey } = require('../util');

const createKeysOfTypeReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityKey, index }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return index
        ? [...state].splice(index, 0, entityKey)
        : [...state, entityKey];
    }
  });
};

const createKeysReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    const keysKey = makeKeysKey(entityType);
    reducers[keysKey] = createKeysOfTypeReducer(schema, actions);
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
  createKeysReducer,
};