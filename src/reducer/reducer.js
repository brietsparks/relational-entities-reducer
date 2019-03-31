const { createEntitiesReducer } = require('./entities-reducer');
const { createIdsReducer } = require('./ids-reducer');
const { getLinkedEntityIds } = require('../selectors');

const createFullReducer = (schemas, actions) => {
  // const { REMOVE } = actions;

  const entitiesReducer = createEntitiesReducer(schemas, actions);
  const idsReducer = createIdsReducer(schemas, actions);

  return (state = {}, action) => {
    //   if (type === actions.REMOVE) {
    //
    //   }

    return {
      entities: entitiesReducer(state.entities, action),
      ids: idsReducer(state.ids, action)
    }
  };
};

module.exports = { createFullReducer };