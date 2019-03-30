const { createEntitiesReducer } = require('./entities-reducer');
const { createKeysReducer } = require('./keys-reducer');
const { getLinkedEntityKeys } = require('../selectors');

const createFullReducer = (schemas, actions) => {
  // const { REMOVE } = actions;

  const entitiesReducer = createEntitiesReducer(schemas, actions);
  const keysReducer = createKeysReducer(schemas, actions);

  return (state = {}, action) => {
    //   if (type === actions.REMOVE) {
    //
    //   }

    return {
      entities: entitiesReducer(state.entities, action),
      keys: keysReducer(state.keys, action)
    }
  };
};

module.exports = { createFullReducer };