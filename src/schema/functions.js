const validateSchemaDefs = (schemaDefs = {}) => {
  Object.keys(schemaDefs).forEach(type => {
    const schema = schemaDefs[type];

    if (schema.type !== type) {
      throw new Error(`schemaDefs key "${type}" does not equal its type "${schema.type}"`);
    }

    if (!Array.isArray(schema.many)) {
      throw new Error(`${type} schema .many must be an array`);
    }

    schema.many.forEach(relType => {
      if (!schemaDefs.hasOwnProperty(relType)) {
        throw new Error(`${type} .many relation "${relType}" does not have a schema`);
      }
    });

    if (!Array.isArray(schema.one)) {
      throw new Error(`${type} schema .one must be an array`);
    }

    schema.one.forEach(relType => {
      if (!schemaDefs.hasOwnProperty(relType)) {
        throw new Error(`${type} .one relation "${relType}" does not have a schema`);
      }
    });

    schema.many.forEach(relType => {
      if (schema.one.includes(relType)) {
        throw new Error(`${type} relation to "${relType}" cannot be both a one and many relation`);
      }
    });

    schema.one.forEach(relType => {
      if (schema.many.includes(relType)) {
        throw new Error(`${type} relation to "${relType}" cannot be both a one and many relation`);
      }
    })
  });
};

// this mutates
const cleanSchemaDefs = (schemaDefs) => {
  Object.keys(schemaDefs).forEach(type => {
    const schema = schemaDefs[type];

    schema.type = type;

    schema.many = schema.many || [];
    schema.one = schema.one || [];
  });

  return schemaDefs;
};

module.exports = {
  validateSchemaDefs,
  cleanSchemaDefs
};