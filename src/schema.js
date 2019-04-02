const { makeIdKey, makeIdsKey } = require('./util');

const validateSchemasObject = (schemas = {}) => {
  Object.keys(schemas).forEach(type => {
    const schema = schemas[type];

    if (schema.type !== type) {
      throw new Error(`schemas key "${type}" does not equal its type "${schema.type}"`);
    }

    if (!Array.isArray(schema.many)) {
      throw new Error(`${type} schema .many must be an array`);
    }

    schema.many.forEach(relType => {
      if (!schemas.hasOwnProperty(relType)) {
        throw new Error(`${type} .many relation "${relType}" does not have a schema`);
      }
    });

    if (!Array.isArray(schema.one)) {
      throw new Error(`${type} schema .one must be an array`);
    }

    schema.one.forEach(relType => {
      if (!schemas.hasOwnProperty(relType)) {
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
const transformSchemasObject = (schemas) => {
  Object.keys(schemas).forEach(type => {
    const schema = schemas[type];

    schema.many = schema.many || [];
    schema.one = schema.one || [];

    // schema.idsKeys = schema.many.map(relEntityType => makeIdsKey(relEntityType));
    // schema.idKeys = schema.one.map(relEntityType => makeIdKey(relEntityType));
  });

  return schemas;
};

module.exports = {
  validateSchemasObject,
  transformSchemasObject
};