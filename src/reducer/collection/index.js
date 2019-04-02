const { createEntitiesReducer } = require('../entities');
const { createIdsReducer } = require('../ids');

const defaultCollectionState = {
  entities: {},
  ids: []
};

const createCollectionReducer = (schema = defaultCollectionState, actions) => {
  const entitiesReducer = createEntitiesReducer(schema, actions);
  const idsReducer = createIdsReducer(schema, actions);

  return (state = {}, action) => ({
    entities: entitiesReducer(state.entities, action),
    ids: idsReducer(state.ids, action)
  });
};

module.exports = { createCollectionReducer, defaultCollectionState };