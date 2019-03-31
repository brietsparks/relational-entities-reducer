const { createReducer } = require('../util');

const createEntitiesOfTypeReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityId, entity, entityExists }) => {
      if (entityType !== schema.type || entityExists) {
        return state;
      }

      return {
        ...state,
        [entityId]: entity
      };
    }
  });
};

const createEntitiesReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    reducers[entityType] = createEntitiesOfTypeReducer(schema, actions);
    return reducers;
  }, {});

  const defaultState = Object.keys(schemas).reduce((defaultState, entityType) => {
    defaultState[entityType] = {};
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
//   const idsKey = `${relEntityType}Keys`;
//   if (!Array.isArray(entity[idsKey])) {
//     entity[idsKey] = [];
//   }
// });
//
// schema.one.forEach(relEntityType => {
//   const idKey = `${relEntityType}Key`;
//   if (!isStringOrNumber(idKey)) {
//     entity[idKey] = null;
//   }
// });