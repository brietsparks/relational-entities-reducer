const { makeIdsKey } = require('./util');

const getEntitiesSubstate = state => state.entities;
const getKeysSubstate = state => state.keys;

const getEntities = (state, { entityType }) => {
  const entitiesSubstate = getEntitiesSubstate(state);

  if (!entitiesSubstate.hasOwnProperty(entityType)) {
    throw new Error(`entity type "${entityType}" not found`);
  }

  return entitiesSubstate[entityType];
};

const getEntity = (state, { entityType, entityId }) => {
  const entities = getEntities(state, { entityType });

  return entities[entityId];
};

const getLinkedEntityIds = (state, { entityType, entityId, linkedEntityType }) => {
  const entity = getEntity(state, { entityType, entityId });

  const manyFk = makeIdsKey(linkedEntityType);
  if (!entity || !entity[manyFk]) {
    return undefined;
  }

  return entity[manyFk];
};

module.exports = {
  getEntitiesSubstate,
  getKeysSubstate,
  getEntities,
  getEntity,
  getLinkedEntityIds,
};