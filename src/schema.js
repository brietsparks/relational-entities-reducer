const validateSchemasObject = (schemas = {}) => {
  Object.keys(schemas).forEach(entityType => {
    const schema = schemas[entityType];

    if (schema.type !== entityType) {
      throw new Error(`schemas key "${entityType}" does not equal its type "${schema.type}"`);
    }

    
  });
};

module.exports = {
  validateSchemasObject
};