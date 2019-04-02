const { createCollectionReducer } = require('./collection');
const { preReduce } = require('./functions');

const createRootReducer = (schemas, actions) => {
  const collectionReducers = Object.keys(schemas).reduce((reducers, entityType) => {
    const schema = schemas[entityType];
    reducers[entityType] = createCollectionReducer(schema, actions);
    return reducers;
  }, {});

  return (state = {}, action) => {
    action = preReduce(schemas, actions, state, action);

    return Object.keys(collectionReducers).reduce((reducedState, stateKey) => {
      const reducer = collectionReducers[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], action);
      return reducedState;
    }, {});
  };
};

module.exports = { createRootReducer };