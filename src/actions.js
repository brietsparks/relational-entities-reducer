const { defaultNamespace, makeIdKey, makeIdsKey } = require('./util');
const { validateSchemasObject } = require('./schema');

const createEntityActions = (schemas, namespace = defaultNamespace) => {
  validateSchemasObject(schemas);

  const ADD = namespace('ADD');
  const REMOVE = namespace('REMOVE');
  const EDIT = namespace('EDIT');
  const LINK = namespace('LINK');
  const UNLINK = namespace('UNLINK');
  const REORDER_ENTITY = namespace('REORDER_ENTITY');
  const REORDER_LINK = namespace('REORDER_LINK');

  const validateEntityType = entityType => {
    if (!schemas.hasOwnProperty(entityType)) {
      throw new Error(`invalid entity type "${entityType}"`);
    }
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
    const schema = schemas[entityType];
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

  const removeMany = () => {}

  const link = (subjectEntityType, subjectEntityId, targetEntities = []) => {

  };

  const linkMany = () => {};

  const unlink = (subjectEntityType, subjectEntityId, targetEntities = []) => {

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

function isStringOrNumber (x) {
  return typeof x === 'string' || typeof x === 'number';
}