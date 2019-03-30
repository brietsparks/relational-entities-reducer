const { createReducer } = require('../util');

const createEntityReducer = (schema, actions) => {
  const { ADD } = actions;

  return createReducer({}, {
    [ADD]: (state, { entityType, entityKey, entity }) => {
      if (entityType !== schema.type) {
        return state;
      }

      // const schema = schemas[entityType];
      //
      // schema.many.forEach(relEntityType => {
      //   const keysKey = `${relEntityType}Keys`;
      //   if (!Array.isArray(entity[keysKey])) {
      //     entity[keysKey] = [];
      //   }
      // });
      //
      // schema.one.forEach(relEntityType => {
      //   const keyKey = `${relEntityType}Key`;
      //   if (!isStringOrNumber(keyKey)) {
      //     entity[keyKey] = null;
      //   }
      // });

      return {
        ...state,
        [entityKey]: entity
      };
    }
  });
};

module.exports = { createEntityReducer };