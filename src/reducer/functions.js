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
  }

  if (action.type === REMOVE) {
    const { entityType, entityId } = action;
    const entity = getEntity(state, { entityType, entityId });
    const schema = schemas[entityType];
    action.links = getLinks(entity, schema);
  }

  if (action.type === LINK) {

  }

  return action;
};

module.exports = {
  getLinks,
  preReduce
};