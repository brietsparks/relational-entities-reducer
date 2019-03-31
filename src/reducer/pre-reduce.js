const { getEntity } = require('../selectors');
const { getLinks } = require('./util');

const preReduce = (schemas, actions, state, action) => {
  const { ADD, REMOVE } = actions;

  if (action.type === ADD) {
    const entity = getEntity(state, {
      entityType: action.entityType,
      entityId: action.entityId
    });

    if (entity) {
      action.entityExists = true;
    }
  }

  if (action.type === REMOVE) {
    const { entityType, entityId } = action;
    const entity = getEntity(state, { entityType, entityId });
    const schema = schemas[entityType];
    action.links = getLinks(entity, schema);
  }

  return action;
};

module.exports = { preReduce };