const removeLinkedIds = (state, entityId, links, schema) => {
  links = links[schema.type];
  if (!links) {
    return state;
  }

  const { key: idsKey, ids: linkedEntityIds } = links;
  const newState = { ...state };

  linkedEntityIds.forEach(linkedEntityId => {
    const newEntity = { ...newState[linkedEntityId] };
    const entityIds = newEntity[idsKey].filter(id => id !== entityId);
    newEntity[idsKey] = entityIds;
  });
};