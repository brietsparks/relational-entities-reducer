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
  const reducers = Object.keys(schemas).reduce((reducers, schemaKey) => {
    const schema = schemas[schemaKey];
    reducers[schema.plural] = createEntitiesOfTypeReducer(schema, actions);
    return reducers;
  }, {});

  return (state = {}, action) => {
    // equivalent of combineReducers
    Object.keys(reducers).reduce((reducedState, stateKey) => {
      const reducer = reducers[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], action);
      return reducedState;
    }, {})
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