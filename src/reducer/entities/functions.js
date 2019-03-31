const { makeIdsKey, makeIdKey } = require('../../util');

const removeLinkedIds = (
  state,
  links = {},
  linkedSchema,
  removableEntityType,
  removableEntityId,
) => {
  const linkedEntityType = linkedSchema.type;

  const linkedEntityIds = links[linkedEntityType];
  if (!linkedEntityIds) {
    return state;
  }

  const newState = { ...state };

  let key;
  if (linkedSchema.many.includes(removableEntityType)) {
    key = makeIdsKey(removableEntityType);

    linkedEntityIds.forEach(linkedEntityId => {
      const newEntity = { ...newState[linkedEntityId] };

      if (!newEntity[key]) {
        return;
      }

      newEntity[key] = newEntity[key].filter(id => id !== removableEntityId);
      newState[linkedEntityId] = newEntity;
    });
  } else if (linkedSchema.one.includes(removableEntityType)) {
    key = makeIdKey(removableEntityType);

    linkedEntityIds.forEach(linkedEntityId => {
      const newEntity = { ...newState[linkedEntityId] };

      if (!newEntity[key]) {
        return;
      }

      if (newEntity[key]) {
        newEntity[key] = null;
        newState[linkedEntityId] = newEntity;
      }
    });
  } else {
    return state;
  }

  return newState;
};

module.exports = { removeLinkedIds };