const { Schemas } = require('../schema');
const { createCollectionReducer } = require('./collection');
const { preReduce } = require('./functions');
const { combineReducers } = require('./util');
const { createEntityActions } = require('../actions');

const createRootReducer = schemaDefs => {
  const schemas = new Schemas(schemaDefs);
  const actions = createEntityActions(schemaDefs);

  const collectionReducers = schemas.getTypes().reduce((reducers, entityType) => {
    const schema = schemas.get(entityType);
    reducers[entityType] = createCollectionReducer(schema, actions);
    return reducers;
  }, {});

  return (state = {}, action) => {
    action = preReduce(schemas, actions, state, action);

    const reducer = combineReducers(collectionReducers);

    return reducer(state, action);
  };
};

module.exports = { createRootReducer };
