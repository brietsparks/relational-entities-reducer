const { makeIdsKey, makeIdKey } = require('../../util');

const removeLinkedIds = (
  state,
  links = {},
  linkedSchema,
  removableEntityType,
  removableEntityId,
) => {
  const linkedEntityType = linkedSchema.type;

  const linked = links[linkedEntityType];
  if (!linked) {
    return state;
  }

  const newState = { ...state };

  let key;
  if (linkedSchema.many.includes(removableEntityType)) {
    key = makeIdsKey(removableEntityType)

    linked.forEach(linkedEntityId => {
      const newEntity = { ...newState[linkedEntityId] };

      if (!newEntity[key]) {
        return;
      }

      newEntity[key] = newEntity[key].filter(id => id !== removableEntityId);
      newState[linkedEntityId] = newEntity;
    });
  } else if (linkedSchema.one.includes(removableEntityType)) {
    key = makeIdKey(removableEntityType);

    const newEntity = { ...newState[linked] };

    if (!newEntity[key]) {
      return;
    }

    newEntity[key] = null;
    newState[linked] = newEntity;
  } else {
    return state;
  }

  return newState;
};

module.exports = { removeLinkedIds };