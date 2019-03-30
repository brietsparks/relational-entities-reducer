const { makeManyFk } = require('./util');

const getEntitiesSubstate = state => state.entities;
const getKeysSubstate = state => state.keys;

const getEntities = (state, { entityType }) => {
  const entitiesSubstate = getEntitiesSubstate(state);

  if (!entitiesSubstate.hasOwnProperty(entityType)) {
    throw new Error(`entity type "${entityType}" not found`);
  }

  return entitiesSubstate[entityType];
};

const getEntity = (state, { entityType, entityKey }) => {
  const entities = getEntities(state, { entityType });

  return entities[entityKey];
};

const getLinkedEntityKeys = (state, { entityType, entityKey, linkedEntityType }) => {
  const entity = getEntity(state, { entityType, entityKey });

  const manyFk = makeManyFk(linkedEntityType);
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
  getLinkedEntityKeys,
};