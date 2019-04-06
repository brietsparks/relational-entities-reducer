const { defaultNamespace } = require('../util');
const { Schemas } = require('../schema');
const { purgeRelationalData } = require('./functions');

const createEntityActions = (schemaDefs, namespace = defaultNamespace) => {
  const schemas = new Schemas(schemaDefs);

  const ADD = namespace('ADD');
  const REMOVE = namespace('REMOVE');
  const EDIT = namespace('EDIT');
  const LINK = namespace('LINK');
  const UNLINK = namespace('UNLINK');
  const REORDER_ENTITY = namespace('REORDER_ENTITY');
  const REORDER_LINK = namespace('REORDER_LINK');

  // todo: standardize checking/exception-throwing

  const validateEntityType = entityType => {
    if (!schemas.has(entityType)) {
      throw new Error(`invalid entity type "${entityType}"`);
    }
  };

  const doesRelationExists = (entityType1, entityType2) => {
    return schemas.get(entityType1).has(entityType2) &&
      schemas.get(entityType2).has(entityType1)
    ;
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

  const edit = (entityType, entityId, entity = {}) => {
    validateEntityType(entityType);

    // not yet supporting changing relational data via edit action
    const schema = schemas.get(entityType);
    purgeRelationalData(schema, entity);

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

    return {
      type: LINK,
      entityType1, entityId1, entityType2, entityId2
    };
  };

  const linkMany = (linkDefs = []) => {};

  const unlink = (entityType1, entityId1, entityType2, entityId2) => {
    validateEntityType(entityType1);
    validateEntityType(entityType2);

    if (!doesRelationExists(entityType1, entityType2)) {
      throw new Error(`cannot unlink a ${entityType1} from a ${entityType2} because the entity schema contains no relation between the two`);
    }

    return {
      type: UNLINK,
      entityType1, entityId1, entityType2, entityId2
    };
  };

  const unlinkMany = () => {};

  const validateIndex = (name, index) => {
    if (index < 0) {
      throw new Error(`invalid ${name}. ${name} must be >=0. given ${index}`);
    }
  };

  const reorderEntity = (entityType, sourceIndex, destinationIndex) => {
    validateEntityType(entityType);

    if (sourceIndex < 0) {
      validateIndex('source index', sourceIndex);
    }

    if (destinationIndex < 0) {
      validateIndex('destination index', destinationIndex);
    }

    return {
      type: REORDER_ENTITY,
      entityType, sourceIndex, destinationIndex
    };
  };

  const reorderLink = (
    entityType,
    entityId,
    foreignEntityType,
    sourceIndex,
    destinationIndex,
    destinationEntityId,
  ) => {
    validateEntityType(entityType);
    validateEntityType(foreignEntityType);

    if (!doesRelationExists(entityType, foreignEntityType)) {
      throw new Error(`cannot reorder ${entityType} entity's ${foreignEntityType} links because no relation exists between the two`);
    }

    validateIndex('source index', sourceIndex);
    validateIndex('destination index', destinationIndex);

    return {
      type: REORDER_LINK,
      entityType,
      entityId,
      foreignEntityType,
      sourceIndex,
      destinationIndex,
      destinationEntityId,
    };
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
