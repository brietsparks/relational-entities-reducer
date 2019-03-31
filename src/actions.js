const { defaultNamespace } = require('./util');

const createEntityActions = (schemas, namespace = defaultNamespace) => {
  const ADD = namespace('ADD');
  const EDIT = namespace('EDIT');
  const REMOVE = namespace('REMOVE');
  const LINK = namespace('LINK');
  const UNLINK = namespace('UNLINK');
  const REORDER_ENTITY = namespace('REORDER_ENTITY');
  const REORDER_LINK = namespace('REORDER_LINK');

  const add = (entityType, entityId, entity = {}, index) => {
    if (!schemas.hasOwnProperty(entityType)) {
      throw new Error(`invalid entity type "${entityType}"`);
    }

    return {
      type: ADD,
      entityType, entityId, entity, index
    }
  };

  const addMany = () => {};

  const remove = (entityType, entityId) => {

  };

  const link = (entityType1, entityId1, entityType2, entityId2) => {

  };

  const unlink = (entityId1, entityId2) => {

  };

  const reorderEntity = (entityType, sourceIndex, destinationIndex) => {

  };

  const reorderLink = (
    entityType,
    sourceEntityId,
    sourceIndex,
    destinationEntityId,
    destinationIndex
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