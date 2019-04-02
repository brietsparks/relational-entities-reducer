const getEntityState = (state, { entityType }) => {
  return state[entityType];
};

const getEntities = (state, { entityType }) => {
  const entityState = getEntityState(state, { entityType });

  if (!entityState) {
    throw new Error(`no state found for entity type "${entityType}"`);
  }

  return entityState.entities;
};

const getIds = (state, { entityType }) => {
  const entityState = getEntityState(state, { entityType });

  if (!entityState) {
    throw new Error(`no state found for entity type "${entityType}"`);
  }

  return entityState.ids;
};

const getEntity = (state, { entityType, entityId }) => {
  const entities = getEntities(state, { entityType });

  return entities[entityId];
};

module.exports = {
  getEntityState,
  getEntities,
  getIds,
  getEntity,
};
