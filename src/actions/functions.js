

const purgeRelationalData = (schema, entity) => {
  // this mutates the action
  schema.getForeignKeys().forEach(foreignKey => {
    if (entity.hasOwnProperty(foreignKey)) {
      delete entity[foreignKey];
    }
  });
};

module.exports = { purgeRelationalData };