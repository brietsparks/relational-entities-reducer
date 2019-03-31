const { getLinks, removeLinkedIds } = require('./functions');
const { createReducer } = require('../util');

const createEntitiesOfTypeReducer = (schema, actions) => {
  const { ADD, REMOVE } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityId, entity, entityExists }) => {
      if (entityType !== schema.type || entityExists) {
        return state;
      }

      return {
        ...state,
        [entityId]: entity
      };
    },
    [REMOVE]: (state, { entityType, entityId, links }) => {
      if (entityType !== schema.type) {
        // if this reducer handles a different entity type than
        // the entity-to-remove, then all of these entities
        // should be unlinked from the entity-to-remove
        return removeLinkedIds(state, links, schema, entityType, entityId);

      } else {
        // if this reducer handles the type of entity that is
        // to be removed, then remove the entity
        const newState = { ...state };
        delete newState[entityId];

        return newState;
      }
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