const { createReducer } = require('../util');

const createKeysOfTypeReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityKey, index }) => {
      if (entityType !== schema.type) {
        return state;
      }

      return index
        ? [...state].splice(index, 0, entityKey)
        : [...state, entityKey];
    }
  });
};

const createKeysReducer = (schemas, actions) => {

};

module.exports = {
  createKeysReducer,
};