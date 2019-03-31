const { createEntitiesReducer } = require('./entities');
const { createIdsReducer } = require('./ids');
const { preReduce } = require('./functions');

const createFullReducer = (schemas, actions) => {
  const entitiesReducer = createEntitiesReducer(schemas, actions);
  const idsReducer = createIdsReducer(schemas, actions);

  return (state = {}, action) => {
    action = preReduce(schemas, actions, state, action);

    return {
      entities: entitiesReducer(state.entities, action),
      ids: idsReducer(state.ids, action)
    }
  };
};

module.exports = { createFullReducer };