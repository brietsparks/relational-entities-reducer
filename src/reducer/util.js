const{ makeIdsKey, makeIdKey } = require( '../util');

const getLinks = (entity, schema) => {
  const links = {};

  if (Array.isArray(schema.many)) {
    schema.many.reduce((links, relEntity) => {
      const idsKey = makeIdsKey(relEntity);
      if (Array.isArray(entity[idsKey])) {
        links[relEntity] = {
          key: idsKey,
          ids: entity[idsKey]
        };
      }
      return links;
    }, links)
  }

  if (Array.isArray(schema.one)) {
    schema.one.reduce((links, relEntity) => {
      const idKey = makeIdKey(relEntity);
      if (entity[idKey]) {
        links[relEntity] = {
          key: idKey,
          ids: [entity[idKey]]
        };
      }
      return links;
    }, links)
  }

  return links;
};

const removeLinkedIds = (state, entityId, links, schema) => {
  links = links[schema.type];
  if (!links) {
    return state;
  }

  const { key: idsKey, ids: linkedEntityIds } = links;
  const newState = { ...state };

  linkedEntityIds.forEach(linkedEntityId => {
    const newEntity = { ...newState[linkedEntityId] };
    const entityIds = newEntity[idsKey].filter(id => id !== entityId);
    newEntity[idsKey] = entityIds;
  });
};

module.exports = {
  getLinks,
  removeLinkedIds
};