const { createReducer } = require('../util');

const createIdsReducer = (schema, actions) => {
  const { ADD, REMOVE, REORDER_ENTITY } = actions;

  return createReducer([], {
    [ADD]: (state, { entityType, entityId, index, entityExists }) => {
      if (entityType !== schema.type || entityExists) {
        return state;
      }

      return index
        ? [...state].splice(index, 0, entityId)
        : [...state, entityId];
    },
    [REMOVE]: (state, { entityType, entityId: removableId }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return state.filter(entityId => entityId !== removableId);
    },
    [REORDER_ENTITY]: (state, { entityType, sourceIndex, destinationIndex }) => {
      if (sourceIndex === destinationIndex) {
        return state;
      }

      const newState = [...state];

      const entityId = newState.splice(sourceIndex, 1)[0];

      if (!entityId) {
        return state;
      }

      newState.splice(destinationIndex, 0, entityId);

      return newState;
    }
  });
};


module.exports = {
  createIdsReducer,
};