const { createReducer } = require('../util');
const { removeLinkedIds } = require('./functions');

const createEntitiesReducer = (schema, actions) => {
  const { ADD, REMOVE, EDIT, LINK, UNLINK } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityId, entity, entityExists }) => {
      if (entityType !== schema.type || entityExists) {
        return state;
      }

      return {
        ...state,
        [entityId]: entity
      };
    },
    [REMOVE]: (state, { entityType, entityId, links }) => {
      if (entityType !== schema.type) {
        // if this reducer handles a different entity type than
        // the entity-to-remove, then all of these entities
        // should be unlinked from the entity-to-remove
        return removeLinkedIds(state, links, schema, entityType, entityId);

      } else {
        // if this reducer handles the type of entity that is
        // to be removed, then remove the entity
        const newState = { ...state };
        delete newState[entityId];

        return newState;
      }
    },
    [EDIT]: (state, { entityType, entityId, entity }) => {
      if (entityType !== schema.type) {
        return state;
      }

      if (!state[entityId]) {
        return state;
      }

      return {
        ...state,
        [entityId]: { ...state[entityId], ...entity }
      };
    },
    [LINK]: (state, { entityType1, entityId1, entityType2, entityId2, entityDoesNotExist }) => {
      if (
        (entityType1 !== schema.type && entityType2 !== schema.type) ||
        entityDoesNotExist
      ) {
        return state;
      }

      let entityId, foreignEntityType, foreignEntityId;
      if (entityType1 === schema.type) {
        entityId = entityId1;
        foreignEntityType = entityType2;
        foreignEntityId = entityId2;
      } else {
        entityId = entityId2;
        foreignEntityType = entityType1;
        foreignEntityId = entityId1;
      }

      const foreignKey = schema.getForeignKey(foreignEntityType);

      const entity = { ...state[entityId] };

      if (!entity[foreignKey]) {
        entity[foreignKey] = [];
      }

      if (entity[foreignKey].includes(foreignEntityId)) {
        return state;
      }

      entity[foreignKey] = [...entity[foreignKey], foreignEntityId];

      return {
        ...state,
        [entityId]: entity
      };
    },

    [UNLINK]: (state, { entityType1, entityId1, entityType2, entityId2 }) => {
      if ((entityType1 !== schema.type && entityType2 !== schema.type)) {
        return state;
      }

      let entityId, foreignEntityType, foreignEntityId;
      if (entityType1 === schema.type) {
        entityId = entityId1;
        foreignEntityType = entityType2;
        foreignEntityId = entityId2;
      } else {
        entityId = entityId2;
        foreignEntityType = entityType1;
        foreignEntityId = entityId1;
      }

      if (!state[entityId]) {
        return state;
      }

      // shallow copy entity
      const entity = { ...state[entityId] };

      if (schema.hasOne(foreignEntityType)) {
        const foreignKey = schema.getForeignKey(foreignEntityType);
        const existingForeignEntityId = entity[foreignKey];

        if (foreignEntityId !== existingForeignEntityId) {
          return state;
        }

        entity[foreignKey] = null;
      }

      if (schema.hasMany(foreignEntityType)) {
        const foreignKey = schema.getForeignKey(foreignEntityType);
        const existingForeignEntityIds = entity[foreignKey];

        if (!existingForeignEntityIds || !existingForeignEntityIds.includes(foreignEntityId)) {
          return state;
        }

        entity[foreignKey] = existingForeignEntityIds.filter(existingForeignEntityId => (
          existingForeignEntityId !== foreignEntityId
        ));
      }

      return {
        ...state,
        [entityId]: entity
      };
    }
  });
};

module.exports = { createEntitiesReducer };