const { createReducer } = require('../util');
const { createEntityActions } = require('../actions');
const { defaultNamespace } = require('../util');
const { createEntityReducer } = require('./entity-reducer');

const createEntitiesReducer = (schemas = [], namespace = defaultNamespace) => {
  const actions = createEntityActions(schemas, namespace);

  const reducers = schemas.reduce((reducers, schema) => {
    reducers[schema.type] = createEntityReducer(schema, actions);
    return reducers;
  }, {});

  const entitiesReducer = (state = {}, action) => {
    const entityType = action.entityType;

    if (action.type === actions.REMOVE) {

    }
  };
};

const createKeysReducer = (schema, namespace = defaultNamespace) => {
  const { ADD } = createEntityActions(schema, namespace);

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
