const { createReducer } = require('../util');

const createEntitiesOfTypeReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityKey, entity }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return {
        ...state,
        [entityKey]: entity
      };
    }
  });
};

const createEntitiesReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    reducers[schema.plural] = createEntitiesOfTypeReducer(schema, actions);
    return reducers;
  }, {});

  const defaultState = Object.keys(schemas).reduce((defaultState, entityType) => {
    const schema = schemas[entityType];
    defaultState[schema.plural] = {};
    return defaultState;
  }, {});

  return (state = defaultState, action) => {
    // equivalent of combineReducers
    return Object.keys(reducers).reduce((reducedState, stateKey) => {
      const reducer = reducers[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], action);
      return reducedState;
    }, {});
  };
};


module.exports = {
  createEntitiesReducer,
};


// const schema = schemas[entityType];
//
// schema.many.forEach(relEntityType => {
//   const keysKey = `${relEntityType}Keys`;
//   if (!Array.isArray(entity[keysKey])) {
//     entity[keysKey] = [];
//   }
// });
//
// schema.one.forEach(relEntityType => {
//   const keyKey = `${relEntityType}Key`;
//   if (!isStringOrNumber(keyKey)) {
//     entity[keyKey] = null;
//   }
// });