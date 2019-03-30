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

const getLinkedEntities = (state, { entityType, entityKey, linkedEntityType }) => {
  const entity = getEntity(state, { entityType, entityKey });

  if (!entity || !entity[linkedEntityType]) {
    return undefined;
  }

  return entity[linkedEntityType];
};

module.exports = {
  getEntitiesSubstate,
  getKeysSubstate,
  getEntities,
  getEntity,
  getLinkedEntities,
};