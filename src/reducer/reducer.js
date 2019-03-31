const { createEntitiesReducer } = require('./entities-reducer');
const { createIdsReducer } = require('./ids-reducer');
const {
  getEntity,
  getLinkedEntityIds
} = require('../selectors');

const createFullReducer = (schemas, actions) => {
  const { ADD } = actions;

  const entitiesReducer = createEntitiesReducer(schemas, actions);
  const idsReducer = createIdsReducer(schemas, actions);

  return (state = {}, action) => {
      if (action.type === ADD) {
        console.log(state);
        const entity = getEntity(state, {
          entityType: action.entityType,
          entityId: action.entityId
        });

        if (entity) {
          action.entityExists = true;
        }
      }

    return {
      entities: entitiesReducer(state.entities, action),
      ids: idsReducer(state.ids, action)
    }
  };
};

module.exports = { createFullReducer };