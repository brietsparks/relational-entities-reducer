const { defaultNamespace, makeIdKey, makeIdsKey } = require('./util');
const { Schemas } = require('./schema');

const createEntityActions = (schemaDefs, namespace = defaultNamespace) => {
  const schemas = new Schemas(schemaDefs);

  const ADD = namespace('ADD');
  const REMOVE = namespace('REMOVE');
  const EDIT = namespace('EDIT');
  const LINK = namespace('LINK');
  const UNLINK = namespace('UNLINK');
  const REORDER_ENTITY = namespace('REORDER_ENTITY');
  const REORDER_LINK = namespace('REORDER_LINK');

  const validateEntityType = entityType => {
    if (!schemas.has(entityType)) {
      throw new Error(`invalid entity type "${entityType}"`);
    }
  };

  const doesRelationExists = (entityType1, entityType2) => {
    return (
      (
        schemas.get(entityType1).hasMany(entityType2) ||
        schemas.get(entityType1).hasOne(entityType2)
      ) && (
        schemas.get(entityType2).hasMany(entityType1) ||
        schemas.get(entityType2).hasOne(entityType1)
      )
    );
  };

  const add = (entityType, entityId, entity = {}, index) => {
    validateEntityType(entityType);

    return {
      type: ADD,
      entityType, entityId, entity, index
    }
  };

  const addMany = () => {};

  const remove = (entityType, entityId) => {
    validateEntityType(entityType);

    return {
      type: REMOVE,
      entityType, entityId
    };
  };

  const edit = (entityType, entityId, entity) => {
    validateEntityType(entityType);

    // edit does not yet support changing relational data
    const schema = schemas.get(entityType);
    schema.many.forEach(relEntityType => {
      const idsKey = makeIdsKey(relEntityType);
      if (entity.hasOwnProperty(idsKey)) {
        delete entity[idsKey];
      }
    });

    schema.one.forEach(relEntityType => {
      const idKey = makeIdKey(relEntityType);
      if (entity.hasOwnProperty(idKey)) {
        delete entity[idKey];
      }
    });

    return {
      type: EDIT,
      entityType, entityId, entity
    }
  };

  const removeMany = () => {};

  const link = (entityType1, entityId1, entityType2, entityId2) => {
    validateEntityType(entityType1);
    validateEntityType(entityType2);

    if (!doesRelationExists(entityType1, entityType2)) {
      throw new Error(`cannot link a ${entityType1} with a ${entityType2} because the entity schema contains no relation between the two`);
    }
1
    return {
      type: LINK,
      entityType1, entityId1, entityType2, entityId2
    };
  };

  const linkMany = (linkDefs = []) => {};

  const unlink = (entityType1, entityId1, targetEntities = []) => {

  };

  const unlinkMany = () => {};

  const reorderEntity = (entityType, sourceIndex, destinationIndex) => {

  };

  const reorderLink = (
    sourceEntityType,
    sourceEntityId,
    linkedEntityType,
    sourceIndex,
    destinationIndex,
    destinationEntityId,
  ) => {

  };

  return {
    ADD,
    EDIT,
    REMOVE,
    LINK,
    UNLINK,
    REORDER_ENTITY,
    REORDER_LINK,
    add,
    remove,
    edit,
    link,
    unlink,
    reorderEntity,
    reorderLink
  };
};

module.exports = {
  createEntityActions
};
