const { validateSchemasObject } = require('./schema');

describe('parseSchema', () => {
  describe('validateSchemas', () => {
    test('schemas key must equal type', () => {
      let actual, error;

      actual = () => validateSchemasObject({ foo: {} });
      error = new Error('schemas key "foo" does not equal its type "undefined"');
      expect(actual).toThrow(error);

      actual = () => validateSchemasObject({ foo: { type: 'bar' } });
      error = new Error('schemas key "foo" does not equal its type "bar"');
      expect(actual).toThrow(error);
    });

    test('schema .many must be an array', () => {
      const schemas = {
        foo: {
          type: 'foo',
          many: 'bar'
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo schema .many must be an array');

      expect(actual).toThrow(error);
    });

    test('many-relation entity schema must exist', () => {
      const schemas = {
        foo: {
          type: 'foo',
          many: ['bar']
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo .many relation "bar" does not have a schema');

      expect(actual).toThrow(error);
    });

    test('schema .one must be an array', () => {
      const schemas = {
        foo: {
          type: 'foo',
          one: 'bar'
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo schema .one must be an array');

      expect(actual).toThrow(error);
    });

    test('one-relation entity schema must exist', () => {
      const schemas = {
        foo: {
          type: 'foo',
          one: ['bar']
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo .one relation "bar" does not have a schema');

      expect(actual).toThrow(error);
    });

    test('valid', () => {
      const schemas = {
        skill: {
          type: 'skill',
          plural: 'skills',
          many: ['project']
        },
        project: {
          type: 'project',
          plural: 'projects',
          many: ['skill'],
          one: ['job']
        },
        job: {
          type: 'job',
          plural: 'jobs',
          many: ['project']
        }
      };

      validateSchemasObject(schemas);
    });
  });
});