const { createReducer } = require('../util');

const createEntityReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityKey, entity }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return {
        ...state,
        [entityKey]: entity
      };
    }
  });
};

module.exports = { createEntityReducer };