const { createReducer } = require('../util');
const { removeLinkedIds } = require('./functions');

const createEntitiesReducer = (schema, actions) => {
  const { ADD, REMOVE, EDIT } = actions;

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

      return {
        ...state,
        [entityId]: { ...state[entityId], ...entity }
      };
    }
  });
};

module.exports = { createEntitiesReducer };