const defaultNamespace = actionType => `entities.${actionType}`;

const makeIdsKey = entityType => `${entityType}Ids`;
const makeIdKey = entityType => `${entityType}Id`;

module.exports = {
  defaultNamespace,
  makeIdsKey,
  makeIdKey
};