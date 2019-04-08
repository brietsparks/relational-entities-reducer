const { createReducer } = require('../util');
const { removeLinkedIds } = require('./functions');

const createEntitiesReducer = (schema, actions) => {
  const { ADD, REMOVE, EDIT, LINK, UNLINK, REORDER_LINK } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityId, entity, entityExists, links }) => {
      if (entityExists) {
        return state;
      }

      // please refactor
      if (entityType !== schema.type) {
        if (!links || !Object.keys(links).includes(schema.type)) {
          return state;
        }

        const newState = { ...state };

        const foreignKey = schema.getForeignKey(entityType);

        if (Array.isArray(links[schema.type])) {
          const linkableEntityIds = links[schema.type];
          linkableEntityIds.forEach(linkableEntityId => {
            const linkableEntity = { ...state[linkableEntityId] };
            const linkableEntityForeignEntityIds = linkableEntity[foreignKey] || [];
            linkableEntity[foreignKey] = [...linkableEntityForeignEntityIds, entityId];
            newState[linkableEntityId] = linkableEntity;
          });
        } else {
          const linkableEntityId = links[schema.type];
          const linkableEntity = { ...state[linkableEntityId] };
          const linkableEntityForeignEntityIds = linkableEntity[foreignKey] || [];
          linkableEntity[foreignKey] = [...linkableEntityForeignEntityIds, entityId];
          newState[linkableEntityId] = linkableEntity;
        }

        return newState;
      }

      return {
        ...state,
        [entityId]: entity
      };
    },
    [REMOVE]: (state, { entityType, entityId, links, deletableLinkedEntityTypes }) => {
      if (entityType !== schema.type) {
        if (deletableLinkedEntityTypes.includes(schema.type)) {
          const deletableEntityIds = links[schema.type];

          if (!deletableEntityIds) {
            return state;
          }

          const newState = { ...state };

          deletableEntityIds.forEach(deletableEntityId => {
            delete newState[deletableEntityId];
          });

          return newState;
        }

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
    },
    [REORDER_LINK]: (state, {
      entityType,
      entityId,
      foreignEntityType,
      sourceIndex,
      destinationIndex,
      destinationEntityId,
    }) => {
      if (schema.type !== entityType) {
        return state;
      }

      const entity = state[entityId];

      // no-op when non-existent entity
      if (!entity) {
        return state;
      }

      // whether we are attempting to reorder the foreign entity id within the same entity;
      const reorderInSameEntity = entityId === destinationEntityId || !destinationEntityId;

      const destinationEntity = reorderInSameEntity
        ? entity
        : state[destinationEntityId];

      // no-op when non-existent destination entity
      if (!destinationEntity) {
        return state;
      }

      const foreignKey = schema.getForeignKey(foreignEntityType);
      const foreignEntityIds = entity[foreignKey];

      // no-op when the foreign entity ids variable is not an array
      if (!foreignEntityIds || !Array.isArray(foreignEntityIds)) {
        return state;
      }

      // shallow copy the foreign entity ids
      const newForeignEntityIds = [...foreignEntityIds];

      // take foreign entity id out of the collection
      const foreignEntityId = newForeignEntityIds.splice(sourceIndex, 1)[0];

      // no-op when non-existent source index
      if (!foreignEntityId) {
        return state;
      }

      if (reorderInSameEntity) {
        // reorder link within the same entity
        newForeignEntityIds.splice(destinationIndex, 0, foreignEntityId);
      }

      // shallow copy entity with new foreign entity ids
      const newEntity = { ...entity, [foreignKey]: newForeignEntityIds };

      if (!reorderInSameEntity) {
        // reorder link to a different entity
        let destinationForeignEntityIds = destinationEntity[foreignKey];

        destinationForeignEntityIds = Array.isArray(destinationForeignEntityIds)
          ? destinationForeignEntityIds
          : [];

        const newDestinationForeignEntityIds = [...destinationForeignEntityIds];

        newDestinationForeignEntityIds.splice(destinationIndex, 0, foreignEntityId);

        const newDestinationEntity = {
          ...destinationEntity,
          [foreignKey]: newDestinationForeignEntityIds
        };

        return {
          ...state,
          [entityId]: newEntity,
          [destinationEntityId]: newDestinationEntity
        };
      }

      return {
        ...state,
        [entityId]: newEntity
      };
    }
  });
};

module.exports = { createEntitiesReducer };