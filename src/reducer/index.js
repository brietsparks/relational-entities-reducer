const { createCollectionReducer } = require('./collection');
const { preReduce } = require('./functions');
const { combineReducers } = require('./util');

const createRootReducer = (schemas, actions) => {
  const collectionReducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
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