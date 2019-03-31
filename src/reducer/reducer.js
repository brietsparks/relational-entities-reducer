const { createEntitiesReducer } = require('./entities-reducer');
const { createIdsReducer } = require('./ids-reducer');
const { preReduce } = require('./pre-reduce');

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