const { getEntity } = require('../selectors');

const preReduce = (schemas, actions, state, action) => {
  const { ADD, REMOVE, LINK } = actions;

  if (action.type === ADD) {
    const { entityType, entityId, entity } = action;

    // check if entity already exists
    const entityExists = getEntity(state, { entityType, entityId });
    if (entityExists) {
      // if so, then add a flag so that the ids reducer
      // does not have to iterate to make this check
      action.entityExists = true;
    }

    // handle entity containing foreign keys
    const schema = schemas.get(entityType);
    const links = getLinks(entity, schema, state);
    if (Object.keys(links).length) {
      action.links = links;
    }

    return action;
  }

  if (action.type === REMOVE) {
    const { entityType, entityId } = action;
    const entity = getEntity(state, { entityType, entityId });
    const schema = schemas.get(entityType);
    action.links = getLinks(entity, schema, state);

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

const getLinks = (entity, schema, state) => {
  const links = {};

  schema.getManyForeignKeys().reduce((links, foreignKey) => {
    const foreignEntityIds = entity[foreignKey];

    if (Array.isArray(foreignEntityIds)) {
      const foreignEntityType = schema.getEntityType(foreignKey);

      links[foreignEntityType] = foreignEntityIds.filter(foreignEntityId => {
        return !!getEntity(state, {
          entityType: foreignEntityType,
          entityId: foreignEntityId
        });
      });
    }

    return links;
  }, links);

  schema.getOneForeignKeys().reduce((links, foreignKey) => {
    const foreignEntityId = entity[foreignKey];

    if (foreignEntityId) {
      const foreignEntityType = schema.getEntityType(foreignKey);

      const entityExists = getEntity(state, {
        entityType: foreignEntityType,
        entityId: foreignEntityId
      });

      if (entityExists) {
        links[foreignEntityType] = foreignEntityId;
      }
    }
    return links;
  }, links);

  return links;
};

module.exports = {
  getLinks,
  preReduce
};