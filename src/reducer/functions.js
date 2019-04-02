const { makeIdsKey, makeIdKey } = require('../util');
const { getEntity } = require('../selectors');

const getLinks = (entity, schema) => {
  const links = {};

  if (Array.isArray(schema.many)) {
    schema.many.reduce((links, relEntity) => {
      const idsKey = makeIdsKey(relEntity);
      if (Array.isArray(entity[idsKey])) {
        links[relEntity] = entity[idsKey];
      }
      return links;
    }, links)
  }

  if (Array.isArray(schema.one)) {
    schema.one.reduce((links, relEntity) => {
      const idKey = makeIdKey(relEntity);
      if (entity[idKey]) {
        links[relEntity] = entity[idKey];
      }
      return links;
    }, links)
  }

  return links;
};

const preReduce = (schemas, actions, state, action) => {
  const { ADD, REMOVE, LINK } = actions;

  if (action.type === ADD) {
    const entity = getEntity(state, {
      entityType: action.entityType,
      entityId: action.entityId
    });

    if (entity) {
      action.entityExists = true;
    }

    return action;
  }

  if (action.type === REMOVE) {
    const { entityType, entityId } = action;
    const entity = getEntity(state, { entityType, entityId });
    const schema = schemas[entityType];
    action.links = getLinks(entity, schema);

    return action;
  }

  if (action.type === LINK) {
    const { entityType1, entityId1, entityType2, entityId2 } = action;

    const entity1 = getEntity(state, {
      entityType: entityType1,
      entityId: entityId1
    });

    if (!entity1) {
      action.entityDoesNotExist = true;
      return action;
    }

    const entity2 = getEntity(state, {
      entityType: entityType2,
      entityId: entityId2
    });

    if (!entity2) {
      action.entityDoesNotExist = true;
      return action;
    }
  }

  return action;
};

module.exports = {
  getLinks,
  preReduce
};