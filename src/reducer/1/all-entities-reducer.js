const { createReducer } = require('../util');
const { createEntityActions } = require('../actions');
const { defaultNamespace } = require('../util');
const { createEntityReducer } = require('./entity-reducer');

const createAllEntitiesReducer = (schemas, actions) => {
  const reducers = Object.keys(schemas).reduce((reducers, schemaKey) => {
    const schema = schemas[schemaKey];
    reducers[schema.plural] = createEntityReducer(schema, actions);
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

module.exports = { createAllEntitiesReducer };
