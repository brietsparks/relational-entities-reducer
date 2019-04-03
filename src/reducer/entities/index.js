const { createReducer } = require('../util');
const { removeLinkedIds } = require('./functions');

const createEntitiesReducer = (schema, actions) => {
  const { ADD, REMOVE, EDIT, LINK } = actions;

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
    [EDIT]: (state, { entityType, entityId, entity, entityDoesNotExist }) => {
      if (entityType !== schema.type || entityDoesNotExist) {
        return state;
      }

      return {
        ...state,
        [entityId]: { ...state[entityId], ...entity }
      };
    },
    [LINK]: (state, { entityType1, entityId1, entityType2, entityId2 }) => {
      if (entityType1 !== schema.type && entityType2 !== schema.type) {
        return state;
      }
    }
  });
};

module.exports = { createEntitiesReducer };