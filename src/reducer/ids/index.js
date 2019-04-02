const { createReducer } = require('../util');

const createIdsReducer = (schema, actions) => {
  const { ADD, REMOVE } = actions;

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
    }
  });
};


module.exports = {
  createIdsReducer,
};