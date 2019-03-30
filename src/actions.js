const { defaultNamespace } = require('./util');

const createEntityActions = (schemas, namespace = defaultNamespace) => {
  const ADD = namespace('ADD');
  const EDIT = namespace('EDIT');
  const REMOVE = namespace('REMOVE');
  const LINK = namespace('LINK');
  const UNLINK = namespace('UNLINK');
  const REORDER_ENTITY = namespace('REORDER_ENTITY');
  const REORDER_LINK = namespace('REORDER_LINK');

  const add = (
    entityType,
    entityKey,
    entity = {},
    index
  ) => {
    if (!schemas.hasOwnProperty(entityType)) {
      throw new Error(`invalid entity type "${entityType}"`);
    }

    return {
      type: ADD,
      entityType, entityKey, entity, index
    }
  };

  const addMany = () => {};

  const remove = (entityType, entityKey) => {

  };

  const link = (entityType1, entityKey1, entityType2, entityKey2) => {

  };

  const unlink = (entityKey1, entityKey2) => {

  };

  const reorderEntity = (entityType, sourceIndex, destinationIndex) => {

  };

  const reorderLink = (
    entityType,
    sourceEntityKey,
    sourceIndex,
    destinationEntityKey,
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