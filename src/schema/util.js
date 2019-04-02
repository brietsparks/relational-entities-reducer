const makeManyFk = entityType => `${entityType}Ids`;
const makeOneFk = entityType => `${entityType}Id`;

module.exports = {
  makeManyFk,
  makeOneFk
};